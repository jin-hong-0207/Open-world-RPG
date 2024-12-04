import { ITEMS_CONFIG, ITEM_TYPES, RARITY_LEVELS } from '../items/item-config.js';

class InventorySystem {
    constructor() {
        this.inventories = new Map(); // playerId -> Inventory
        this.equippedItems = new Map(); // playerId -> EquippedItems
    }

    // Create new inventory
    createInventory(playerId, size = 30) {
        const inventory = {
            slots: new Array(size).fill(null),
            gold: 0,
            size
        };

        this.inventories.set(playerId, inventory);
        this.equippedItems.set(playerId, {
            weapon: null,
            armor: null,
            accessories: []
        });

        return inventory;
    }

    // Add item to inventory
    addItem(playerId, itemId, amount = 1) {
        const inventory = this.inventories.get(playerId);
        if (!inventory) {
            return { success: false, error: 'Inventory not found' };
        }

        const itemConfig = ITEMS_CONFIG[itemId];
        if (!itemConfig) {
            return { success: false, error: 'Invalid item' };
        }

        // Handle stackable items
        if (itemConfig.stackable) {
            const result = this.addStackableItem(inventory, itemConfig, amount);
            if (result.success) {
                return result;
            }
        }

        // Handle non-stackable items
        return this.addNonStackableItem(inventory, itemConfig, amount);
    }

    // Add stackable item
    addStackableItem(inventory, itemConfig, amount) {
        // Try to add to existing stacks
        for (let i = 0; i < inventory.slots.length; i++) {
            const slot = inventory.slots[i];
            if (slot && slot.itemId === itemConfig.id && slot.amount < itemConfig.maxStack) {
                const spaceInStack = itemConfig.maxStack - slot.amount;
                const amountToAdd = Math.min(amount, spaceInStack);
                
                slot.amount += amountToAdd;
                amount -= amountToAdd;

                if (amount === 0) {
                    return { success: true, slot: i };
                }
            }
        }

        // Create new stacks for remaining amount
        while (amount > 0) {
            const emptySlot = this.findEmptySlot(inventory);
            if (emptySlot === -1) {
                return { success: false, error: 'Inventory full' };
            }

            const stackAmount = Math.min(amount, itemConfig.maxStack);
            inventory.slots[emptySlot] = {
                itemId: itemConfig.id,
                amount: stackAmount
            };
            amount -= stackAmount;
        }

        return { success: true };
    }

    // Add non-stackable item
    addNonStackableItem(inventory, itemConfig, amount) {
        for (let i = 0; i < amount; i++) {
            const emptySlot = this.findEmptySlot(inventory);
            if (emptySlot === -1) {
                return { success: false, error: 'Inventory full' };
            }

            inventory.slots[emptySlot] = {
                itemId: itemConfig.id,
                amount: 1
            };
        }

        return { success: true };
    }

    // Remove item from inventory
    removeItem(playerId, itemId, amount = 1) {
        const inventory = this.inventories.get(playerId);
        if (!inventory) {
            return { success: false, error: 'Inventory not found' };
        }

        let remainingAmount = amount;

        // Remove items from slots
        for (let i = 0; i < inventory.slots.length && remainingAmount > 0; i++) {
            const slot = inventory.slots[i];
            if (slot && slot.itemId === itemId) {
                const removeAmount = Math.min(remainingAmount, slot.amount);
                slot.amount -= removeAmount;
                remainingAmount -= removeAmount;

                if (slot.amount === 0) {
                    inventory.slots[i] = null;
                }
            }
        }

        return {
            success: remainingAmount === 0,
            error: remainingAmount > 0 ? 'Not enough items' : null
        };
    }

    // Equip item
    equipItem(playerId, slotIndex) {
        const inventory = this.inventories.get(playerId);
        const equipped = this.equippedItems.get(playerId);
        if (!inventory || !equipped) {
            return { success: false, error: 'Inventory not found' };
        }

        const itemSlot = inventory.slots[slotIndex];
        if (!itemSlot) {
            return { success: false, error: 'No item in slot' };
        }

        const itemConfig = ITEMS_CONFIG[itemSlot.itemId];
        if (!itemConfig) {
            return { success: false, error: 'Invalid item' };
        }

        // Check if item is equippable
        if (!this.isEquippable(itemConfig)) {
            return { success: false, error: 'Item cannot be equipped' };
        }

        // Unequip current item if any
        const currentEquipped = this.getEquippedItemInSlot(equipped, itemConfig.type);
        if (currentEquipped) {
            this.unequipItem(playerId, itemConfig.type);
        }

        // Equip new item
        this.setEquippedItem(equipped, itemConfig.type, {
            itemId: itemSlot.itemId,
            slotIndex
        });

        // Remove from inventory
        inventory.slots[slotIndex] = null;

        return { success: true };
    }

    // Unequip item
    unequipItem(playerId, itemType) {
        const inventory = this.inventories.get(playerId);
        const equipped = this.equippedItems.get(playerId);
        if (!inventory || !equipped) {
            return { success: false, error: 'Inventory not found' };
        }

        const equippedItem = this.getEquippedItemInSlot(equipped, itemType);
        if (!equippedItem) {
            return { success: false, error: 'No item equipped' };
        }

        // Find empty slot
        const emptySlot = this.findEmptySlot(inventory);
        if (emptySlot === -1) {
            return { success: false, error: 'Inventory full' };
        }

        // Move item to inventory
        inventory.slots[emptySlot] = {
            itemId: equippedItem.itemId,
            amount: 1
        };

        // Remove from equipped
        this.setEquippedItem(equipped, itemType, null);

        return { success: true };
    }

    // Get inventory contents
    getInventory(playerId) {
        return this.inventories.get(playerId);
    }

    // Get equipped items
    getEquippedItems(playerId) {
        return this.equippedItems.get(playerId);
    }

    // Check if item exists in inventory
    hasItem(playerId, itemId, amount = 1) {
        const inventory = this.inventories.get(playerId);
        if (!inventory) return false;

        let totalAmount = 0;
        for (const slot of inventory.slots) {
            if (slot && slot.itemId === itemId) {
                totalAmount += slot.amount;
                if (totalAmount >= amount) {
                    return true;
                }
            }
        }

        return false;
    }

    // Add gold to inventory
    addGold(playerId, amount) {
        const inventory = this.inventories.get(playerId);
        if (!inventory) {
            return { success: false, error: 'Inventory not found' };
        }

        inventory.gold += amount;
        return { success: true, gold: inventory.gold };
    }

    // Remove gold from inventory
    removeGold(playerId, amount) {
        const inventory = this.inventories.get(playerId);
        if (!inventory) {
            return { success: false, error: 'Inventory not found' };
        }

        if (inventory.gold < amount) {
            return { success: false, error: 'Not enough gold' };
        }

        inventory.gold -= amount;
        return { success: true, gold: inventory.gold };
    }

    // Helper: Find empty inventory slot
    findEmptySlot(inventory) {
        return inventory.slots.findIndex(slot => !slot);
    }

    // Helper: Check if item is equippable
    isEquippable(itemConfig) {
        return itemConfig.type === ITEM_TYPES.WEAPON || 
               itemConfig.type === ITEM_TYPES.ARMOR;
    }

    // Helper: Get equipped item in slot
    getEquippedItemInSlot(equipped, itemType) {
        switch (itemType) {
            case ITEM_TYPES.WEAPON:
                return equipped.weapon;
            case ITEM_TYPES.ARMOR:
                return equipped.armor;
            default:
                return null;
        }
    }

    // Helper: Set equipped item
    setEquippedItem(equipped, itemType, item) {
        switch (itemType) {
            case ITEM_TYPES.WEAPON:
                equipped.weapon = item;
                break;
            case ITEM_TYPES.ARMOR:
                equipped.armor = item;
                break;
        }
    }
}

export default InventorySystem;
