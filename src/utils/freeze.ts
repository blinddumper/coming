export let freeze = <T> (obj: T): Readonly<T> => Object.freeze(obj);
