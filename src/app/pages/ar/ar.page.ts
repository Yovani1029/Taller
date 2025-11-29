import {
  Component,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-ar',
  templateUrl: './ar.page.html',
  styleUrls: ['./ar.page.scss'],
  standalone: false
})
export class ArPage implements OnInit, OnDestroy {

  private sceneEl?: HTMLElement;

  targets = [
    {
      name: 'carro',
      pattern: 'assets/ar/patterns/carro.patt',
      model: 'assets/ar/models/carro/car_glb.glb',
      scale: '0.5 0.5 0.5',
      position: '0 0 0'
    },
    {
      name: 'moto',
      pattern: 'assets/ar/patterns/moto.patt',
      model: 'assets/ar/models/moto/moto.glb',
      scale: '0.4 0.4 0.4',
      position: '0 0 0'
    },
    {
      name: 'ak',
      pattern: 'assets/ar/patterns/ak.patt',
      model: 'assets/ar/models/ak/ak.glb',
      scale: '0.6 0.6 0.6',
      position: '0 0 0'
    },
      {
      name: 'martillo',
      pattern: 'assets/ar/patterns/martillo.patt',
      model: 'assets/ar/models/martillo/martillo.glb',
      scale: '0.6 0.6 0.6',
      position: '0 0 0'
    }
  ];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.loadARScene();
  }

  ngOnDestroy() {
    if (this.sceneEl) this.sceneEl.remove();
  }

  loadARScene() {
    const container = this.el.nativeElement.querySelector('#ar-container');

    const scene = this.renderer.createElement('a-scene');
    this.renderer.setAttribute(scene, 'embedded', 'true');
    this.renderer.setAttribute(scene, 'vr-mode-ui', 'enabled: false');
    this.renderer.setAttribute(scene, 'arjs', `
      trackingMethod: best;
      sourceType: webcam;
      debugUIEnabled: false;
    `);

    this.targets.forEach(target => {
      const marker = this.renderer.createElement('a-marker');
      this.renderer.setAttribute(marker, 'type', 'pattern');
      this.renderer.setAttribute(marker, 'url', target.pattern);

      const model = this.renderer.createElement('a-entity');
      this.renderer.setAttribute(model, 'gltf-model', target.model);
      this.renderer.setAttribute(model, 'scale', target.scale);
      this.renderer.setAttribute(model, 'position', target.position);

      this.renderer.appendChild(marker, model);
      this.renderer.appendChild(scene, marker);
    });

    const camera = this.renderer.createElement('a-entity');
    this.renderer.setAttribute(camera, 'camera', '');
    this.renderer.appendChild(scene, camera);

    this.renderer.appendChild(container, scene);
    this.sceneEl = scene;
  }
}
