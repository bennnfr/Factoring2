
export class Usuario {

    constructor(
        public nombre: string,
        public email: string,
        public password: string,
        public img?: string,
        public role?: string,
        public google?: boolean,
        public _id?: string
    ) { }

}

export class Usuario2 {

    constructor(
        public nombre: string,
        public email: string,
        public password: string,
        public puesto?: string,
        public genero?: string,
        public estatus?: string
    ) { }

}

export class Usuario3 {

    constructor(
        public id: string,
        public nombre: string,
        public email: string,
        public puesto?: string,
        public genero?: string,
        public estatus?: string
    ) { }

}

export class Privilegio {

    constructor(

        public descripcion: string,
        public key: string,
        public valor: string,
        public documentacion: string,
    ) { }

}

export class Idd {

    constructor(

        public id: string
    ) {}
}

export class UserOptions {

    public idoption: string;
    public name: string;
    public id: string;

}

export interface Car {
    vin?: any;
}

export interface Facturas {
    invoice_folio?: any;
}
