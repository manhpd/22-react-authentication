export interface Event {
    id?: string;
    title: string;
    image: string;
    date: string;
    description: string;
}

export interface EventFormProps {
    method: 'post' | 'get' | 'put' | 'delete' | 'patch';
    event?: Event;
}

export interface ActionData {
    errors?: { [key: string]: string };
}