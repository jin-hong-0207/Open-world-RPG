const http = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const GameServer = require('../gameServer');
const dbHandler = require('./setup');

describe('Game Server Tests', () => {
    let httpServer;
    let gameServer;
    let clientSocket;
    let port;

    beforeAll(async () => {
        await dbHandler.connect();
        httpServer = http.createServer();
        gameServer = new GameServer(httpServer);
        port = 3001;
        httpServer.listen(port);
    });

    afterAll(async () => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
        httpServer.close();
    });

    beforeEach((done) => {
        clientSocket = new Client(`http://localhost:${port}`);
        clientSocket.on('connect', done);
    });

    afterEach(() => {
        clientSocket.close();
    });

    test('player can join game', (done) => {
        const testData = {
            characterId: '123',
            position: { x: 0, y: 0, z: 0 }
        };

        clientSocket.emit('join_game', testData);

        clientSocket.on('game_joined', (data) => {
            expect(data).toBeDefined();
            expect(data.world).toBeDefined();
            expect(data.players).toBeDefined();
            expect(data.character).toBeDefined();
            done();
        });
    });

    test('player movement updates position', (done) => {
        const joinData = {
            characterId: '123',
            position: { x: 0, y: 0, z: 0 }
        };

        const moveData = {
            position: { x: 10, y: 0, z: 10 },
            rotation: { x: 0, y: 45, z: 0 }
        };

        clientSocket.emit('join_game', joinData);

        clientSocket.on('game_joined', () => {
            clientSocket.emit('player_move', moveData);
        });

        clientSocket.on('game_state_update', (data) => {
            const player = data.players.find(p => p.characterId === '123');
            if (player && player.position.x === 10) {
                expect(player.position).toEqual(moveData.position);
                done();
            }
        });
    });

    test('puzzle interaction success', (done) => {
        const puzzleData = {
            puzzleId: 'test_puzzle_1',
            solution: 'correct_solution'
        };

        clientSocket.emit('puzzle_interact', puzzleData);

        clientSocket.on('puzzle_result', (result) => {
            expect(result.success).toBe(true);
            done();
        });
    });

    test('skill usage affects character state', (done) => {
        const skillData = {
            skillId: 'meditation',
            target: { x: 0, y: 0, z: 0 }
        };

        clientSocket.emit('use_skill', skillData);

        clientSocket.on('skill_result', (result) => {
            expect(result).toBeDefined();
            expect(result.success).toBeDefined();
            done();
        });
    });
});
