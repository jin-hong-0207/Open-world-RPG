const Client = require('socket.io-client');

class LoadTester {
    constructor(serverUrl, numClients) {
        this.serverUrl = serverUrl;
        this.numClients = numClients;
        this.clients = [];
        this.metrics = {
            connectTimes: [],
            messageTimes: [],
            errors: []
        };
    }

    async runTest() {
        console.log(`Starting load test with ${this.numClients} clients`);
        
        // Connect all clients
        for (let i = 0; i < this.numClients; i++) {
            await this.connectClient(i);
            if (i % 10 === 0) {
                console.log(`Connected ${i + 1} clients`);
            }
        }

        // Simulate random actions
        await this.simulateGameplay(60); // Run for 60 seconds

        // Report results
        this.reportResults();

        // Cleanup
        this.cleanup();
    }

    async connectClient(index) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const client = Client(this.serverUrl);

            client.on('connect', () => {
                const connectTime = Date.now() - startTime;
                this.metrics.connectTimes.push(connectTime);

                // Join game
                client.emit('join_game', {
                    characterId: `test_char_${index}`,
                    position: {
                        x: Math.random() * 100,
                        y: 0,
                        z: Math.random() * 100
                    }
                });

                this.clients.push(client);
                resolve();
            });

            client.on('connect_error', (error) => {
                this.metrics.errors.push({
                    type: 'connect_error',
                    error: error.message,
                    clientIndex: index
                });
                resolve();
            });
        });
    }

    async simulateGameplay(seconds) {
        console.log(`Simulating gameplay for ${seconds} seconds`);
        
        const startTime = Date.now();
        const endTime = startTime + (seconds * 1000);

        while (Date.now() < endTime) {
            // Randomly select clients to perform actions
            for (let client of this.clients) {
                if (Math.random() < 0.1) { // 10% chance each tick
                    this.performRandomAction(client);
                }
            }

            await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms between ticks
        }
    }

    performRandomAction(client) {
        const actions = [
            this.movePlayer,
            this.useSkill,
            this.interactWithPuzzle
        ];

        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const startTime = Date.now();

        randomAction.call(this, client);

        this.metrics.messageTimes.push(Date.now() - startTime);
    }

    movePlayer(client) {
        client.emit('player_move', {
            position: {
                x: Math.random() * 100,
                y: 0,
                z: Math.random() * 100
            },
            rotation: {
                x: 0,
                y: Math.random() * 360,
                z: 0
            }
        });
    }

    useSkill(client) {
        client.emit('use_skill', {
            skillId: 'test_skill',
            target: {
                x: Math.random() * 100,
                y: 0,
                z: Math.random() * 100
            }
        });
    }

    interactWithPuzzle(client) {
        client.emit('puzzle_interact', {
            puzzleId: 'test_puzzle',
            solution: 'test_solution'
        });
    }

    reportResults() {
        const avgConnectTime = this.average(this.metrics.connectTimes);
        const avgMessageTime = this.average(this.metrics.messageTimes);
        const totalErrors = this.metrics.errors.length;

        console.log('\nLoad Test Results:');
        console.log('------------------');
        console.log(`Total Clients: ${this.numClients}`);
        console.log(`Average Connect Time: ${avgConnectTime.toFixed(2)}ms`);
        console.log(`Average Message Time: ${avgMessageTime.toFixed(2)}ms`);
        console.log(`Total Errors: ${totalErrors}`);
        
        if (totalErrors > 0) {
            console.log('\nError Summary:');
            const errorCounts = this.metrics.errors.reduce((acc, error) => {
                acc[error.type] = (acc[error.type] || 0) + 1;
                return acc;
            }, {});
            console.log(errorCounts);
        }
    }

    average(array) {
        return array.length > 0 ? array.reduce((a, b) => a + b) / array.length : 0;
    }

    cleanup() {
        this.clients.forEach(client => client.close());
        console.log('Load test cleanup complete');
    }
}

// Run the load test if this file is executed directly
if (require.main === module) {
    const tester = new LoadTester('http://localhost:3000', 100);
    tester.runTest().catch(console.error);
}

module.exports = LoadTester;
