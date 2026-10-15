/*
 * Register User Use Case
 *
 * Contiene las reglas necesarias para
 * registrar un nuevo usuario.
 */




import { User } from "../entities/User.js";

export class RegisterUser {

    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    async execute(userData) {
        
        if (
            !userData.tipoUsuario ||
            !["estudiante", "profesor"].includes(userData.tipoUsuario)
        ) {
            throw new Error(
                "Debe seleccionar si es estudiante o profesor."
            );
        }

        const existingUser =
            await this.userRepository.findByEmail(
                userData.email
            );

        if (existingUser) {
            throw new Error(
                "Ya existe un usuario con este correo."
            );
        }

        const passwordData =
            await this.passwordHasher.hash(
                userData.password
            );

        const user = new User({
            name: userData.name,
            email: userData.email,
            passwordHash: passwordData,
            tipoUsuario: userData.tipoUsuario
        });

        return await this.userRepository.save(user);
    }
}
    