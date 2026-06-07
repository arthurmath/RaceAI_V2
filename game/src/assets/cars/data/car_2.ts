/**
 * car_2 — F1 McLaren : monoplace chargée depuis le modèle GLB (export Sketchfab).
 * La physique reste sur le collider procédural ; seul le visuel provient du fichier.
 */
import type { VehicleConfig } from '../types';

export const car_2: VehicleConfig = {
    id: 'car_2',
    name: 'F1 Maclaren',
    color: 0xff2d55,
    mass: 1000,
    chassisHalfExtents: { x: 0.85, y: 0.38, z: 1.95 },
    suspensionRestLength: 0.28,
    suspensionStiffness: 32,
    suspensionDamping: 4.0,
    maxSuspensionTravel: 0.28,
    wheelConnections: [
        { x: -0.85, y: -0.25, z: 1.35, steering: true, powered: false },
        { x: 0.85, y: -0.25, z: 1.35, steering: true, powered: false },
        { x: -0.85, y: -0.25, z: -1.35, steering: false, powered: true },
        { x: 0.85, y: -0.25, z: -1.35, steering: false, powered: true },
    ],
    wheelRadius: 0.38,
    wheelFriction: 2.2,
    lateralFriction: 1.1,
    maxSteering: 0.82,
    engineForce: 8000,
    brakeForce: 160,
    handbrakeForce: 420,
    maxSpeed: 82,
    centerOfMassOffset: { x: 0, y: -0.32, z: 0 },

    modelPath: '/models/cars/f1/source/f1.glb',
    /** ~21 unités de longueur native → ~6 m en jeu. */
    modelScale: 0.25,
    /** Le modèle Roblox pointe vers -Z ; la physique utilise +Z comme avant. */
    modelRotation: { x: 0, y: Math.PI, z: 0 },
    /** Origine du mesh au-dessus du sol — aligner les roues sur la piste. */
    modelOffset: { x: 0, y: -0.9, z: 0 },
    /** Braquage visuel des roues avant (mesh GLB statique, essieu fusionné). */
    wheelAnimation: 'steer-only',
    /** GLB Sketchfab : l'essieu avant est Object_13 (Wheel1Mtl, roues G+D fusionnées). */
    steerWheelMeshNames: ['Object_13'],
    /** Le mesh GLB braque visuellement plus fort que la physique. */
    visualSteerScale: 0.65,
};
