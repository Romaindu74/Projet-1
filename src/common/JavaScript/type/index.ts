interface Json extends Object {};

interface Loop {
    new(path: String, logs: Logs);

    path: String;
    logs: Logs;
    uid: Number;
    loop: Json[];
    started: boolean;
    info: Json;
    events: Events;

    event(event: Json): Promise<Json>;
    a(event: Json): Promise<void>;    
    i(): void    
    start(): Promise<void>;    
    add(data: Json, Clients: Clients): number;
}

interface Logs {
    new (p: String)    
    s(t: string): void;
    p(l: number,t: string): void;
    
    critical(text: string): void;    
    error(text: string): void;    
    warning(text: string): void;    
    info(text: string): void;
    debug(text: string): void;
};

interface Clients {
    new(ws: WebSocket, path: String, key: String, logs: Logs): Clients;

    ws : WebSocket;   
    path : String;
    logs : Logs;
    key : String;

    message (message: Uint8Array): Json;
    send (data: Json, encoding?: Boolean): void;
};

interface Data {
    event: string;
    data: object;
}

interface Events {
    Clients: Clients;
    data: Data;
    uid: Number;
}
