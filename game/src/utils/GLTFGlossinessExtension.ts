/**
 * Restores KHR_materials_pbrSpecularGlossiness support removed from Three.js r147+.
 * Maps diffuse textures/factors to MeshStandardMaterial (metal/rough workflow).
 */
import { Color, LinearSRGBColorSpace, MeshStandardMaterial, SRGBColorSpace } from 'three';
import type { GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader.js';

const EXTENSION_NAME = 'KHR_materials_pbrSpecularGlossiness';

export class GLTFGlossinessExtension {
  readonly name = EXTENSION_NAME;

  constructor(private readonly parser: GLTFParser) { }

  getMaterialType(materialIndex: number): typeof MeshStandardMaterial | null {
    const materialDef = this.parser.json.materials?.[materialIndex];
    if (!materialDef?.extensions?.[EXTENSION_NAME]) return null;
    return MeshStandardMaterial;
  }

  extendMaterialParams(materialIndex: number, materialParams: Record<string, unknown>): Promise<void[]> {
    const materialDef = this.parser.json.materials?.[materialIndex];
    const sg = materialDef?.extensions?.[EXTENSION_NAME] as {
      diffuseFactor?: number[];
      diffuseTexture?: { index: number };
      glossinessFactor?: number;
      specularFactor?: number[];
    } | undefined;
    if (!sg) return Promise.resolve([]);

    const pending: Promise<unknown>[] = [];
    const color = materialParams.color as Color;

    if (Array.isArray(sg.diffuseFactor)) {
      color.setRGB(sg.diffuseFactor[0], sg.diffuseFactor[1], sg.diffuseFactor[2], LinearSRGBColorSpace);
      materialParams.opacity = sg.diffuseFactor[3];
    }

    if (sg.diffuseTexture !== undefined) {
      pending.push(
        this.parser.assignTexture(materialParams, 'map', sg.diffuseTexture, SRGBColorSpace),
      );
    }

    const glossiness = sg.glossinessFactor ?? 1;
    materialParams.roughness = Math.max(0.04, 1 - glossiness);
    materialParams.metalness = 0;

    const spec = sg.specularFactor;
    if (Array.isArray(spec)) {
      const specIntensity = (spec[0] + spec[1] + spec[2]) / 3;
      if (specIntensity > 0.5) materialParams.metalness = Math.min(1, specIntensity);
    }

    return Promise.all(pending) as Promise<void[]>;
  }
}

export function registerSpecularGlossinessExtension(loader: { register: (callback: (parser: GLTFParser) => GLTFGlossinessExtension) => void }): void {
  loader.register((parser) => new GLTFGlossinessExtension(parser));
}
