function modules(event, loop) {
    const Clients = event.Clients;

    var Modules = loop.events.events;
    var result = [];
    for (var module of Object.keys(Modules)) {
        result.push({name: module, version: Modules[module].version})
    }
    return { data: result };
}

exports.info = {
    modules: {
        func: modules,
        version: "0.0.0.4"
    }
}