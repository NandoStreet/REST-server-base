import { Schema, model } from 'mongoose';

const RoleSchema = Schema({
    rol:{
        type: String,
        required: [true, 'Rol es requerido']
    }
});

export const Role = model('Role', RoleSchema);
 