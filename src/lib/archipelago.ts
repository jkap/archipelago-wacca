import { Client, Item, type MessageLog, type MessageNode } from 'archipelago.js';
import { readable } from 'svelte/store';

export const client = new Client();

export const items = readable<Item[]>([], (set) => {
	set(client.items.received);
	const updateItems = () => set(client.items.received);
	client.items.on('itemsReceived', updateItems);
	return () => {
		client.items.off('itemsReceived', updateItems);
	};
});

export const checkedLocations = readable<number[]>([], (set) => {
	set(client.room.checkedLocations);
	const updateLocations = () => set(client.room.checkedLocations);
	client.room.on('locationsChecked', updateLocations);
	return () => {
		client.room.off('locationsChecked', updateLocations);
	};
});

export const messageLog = readable<MessageLog>([], (_set, update) => {
	const updateMessages = (text: string, nodes: MessageNode[]) => {
		update((messages) => [...messages, { text, nodes }]);
	};
	client.messages.on('message', updateMessages);
	return () => {
		client.messages.off('message', updateMessages);
	};
});
