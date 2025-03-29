


class LangManager {
    private impl: Lang | null = null;
    private static instance: ProxyConstructor;

    public setImplementation(implementation: Lang) {
        this.impl = implementation;
    }

    public static getInstance() {
        if (!LangManager.instance) {
            const manager = new LangManager();

            const handler = {
                get: function (target: any, prop: any, receiver: any) {
                    if (target.impl && typeof target.impl[prop] === 'function') {
                        return target.impl[prop]
                    }
                    return function (...args: any[]) {
                        if (!args || args.length == 0) {
                            return prop;
                        }
                        return args[0];
                    }
                }
            };
            LangManager.instance = new Proxy(manager, handler);
        }
        return LangManager.instance;
    }

    public implementationExist() {
        return !!this.impl;
    }
}

export {LangManager}