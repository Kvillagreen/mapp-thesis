import { Component, ViewChild, ElementRef, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ScreenSizeService } from '../../../services/rest-api/screen-size.services';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/rest-api/page.service';
import { FontLoader } from 'three-stdlib';
import { TextGeometry } from 'three-stdlib';
import { Router } from '@angular/router';
@Component({
  selector: 'app-map-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-viewer.component.html',
  styleUrl: './map-viewer.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapViewerComponent implements OnChanges {
  kioskData: any[] = [];
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private model: any;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private clickableObjects: THREE.Mesh[] = [];
  errorMessage: string = '';
  fontLoader: FontLoader;
  isMap: boolean = false;
  kioskName: string = '';
  eventId: string = '';
  kioskId: string = '';
  kioskStatus: string = '';
  kioskDescription: string = '';
  mapTerrain: boolean = false;
  kioskImage: string = '';
  kisokx: number = 0;
  kisoky: number = 0;
  myKiosk: any;
  private currentModel: THREE.Object3D | undefined;

  @ViewChild('modelContainer', { static: true }) modelContainer!: ElementRef;

  constructor(public router: Router, private screenSizeService: ScreenSizeService, private eventService: EventService) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.fontLoader = new FontLoader();

  }

  ngOnChanges(isMap: SimpleChanges): void {

  }
  goToDashBoard() {
    this.router.navigate(['/dashboard']);
  }
  

  ngOnInit(): void {

    this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));

    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 0.3, 8.6); // Camera starting position
    this.controls.minDistance = 5;
    this.controls.maxDistance = 30;

    // Adjust renderer properties
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0x404040); // Ambient light for basic illumination
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light for shading
    directionalLight.position.set(20, 20, 20).normalize();
    this.scene.add(directionalLight);
    const eventId = sessionStorage.getItem('eventId') ?? '';

    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
    // Create a Mesh for the kiosk box and set its position
    this.eventService.getKioskMap(eventId).subscribe((data) => {
      this.kioskData = data;

      data.forEach((kiosk: any) => {

        const boxGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        if (kiosk.status == 'available') {
          const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x52796f });
          // Create a Mesh for the kiosk box and set its position
          const kioskMesh = new THREE.Mesh(boxGeometry, boxMaterial);
          kioskMesh.position.set(kiosk.position_x, 0.65, kiosk.position_y);
          kioskMesh.userData = { name: kiosk.kiosk_name, eventsId: eventId, kioskId: kiosk.kiosk_id, kioskStatus: kiosk.status, kioskDescription: kiosk.kiosk_description, kioskImage: kiosk.kiosk_image }; // Attach kiosk name to the mesh

          this.scene.add(kioskMesh);
          this.clickableObjects.push(kioskMesh);
        }
        else if (kiosk.status == 'pending') {

          const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
          // Create a Mesh for the kiosk box and set its position
          const kioskMesh = new THREE.Mesh(boxGeometry, boxMaterial);
          kioskMesh.position.set(kiosk.position_x, 0.65, kiosk.position_y);
          kioskMesh.userData = { name: kiosk.kiosk_name, eventsId: kiosk.event_id, kioskId: kiosk.kiosk_id, kioskStatus: kiosk.status, kioskDescription: kiosk.kiosk_description, kioskImage: kiosk.kiosk_image }; // Attach kiosk name to the mesh

          this.scene.add(kioskMesh);
          this.clickableObjects.push(kioskMesh);
        }
        else if (kiosk.status == 'unavailable') {
          const boxMaterial = new THREE.MeshBasicMaterial({
            color: 0x9d0208
          });
          // Create a Mesh for the kiosk box and set its position
          const kioskMesh = new THREE.Mesh(boxGeometry, boxMaterial);
          kioskMesh.position.set(kiosk.position_x, 0.65, kiosk.position_y);
          kioskMesh.userData = { name: kiosk.kiosk_name, eventsId: kiosk.event_id, kioskId: kiosk.kiosk_id, kioskStatus: kiosk.status, kioskDescription: kiosk.kiosk_description, kioskImage: kiosk.kiosk_image, kiosk }; // Attach kiosk name to the mesh

          this.scene.add(kioskMesh);
          this.clickableObjects.push(kioskMesh);
        }
        else {

        }

        if (kiosk.status != 'disable') {
          this.fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const geometry = new TextGeometry(kiosk.kiosk_name.replace(/\D/g, ''), { // Use kiosk name for dynamic text
              font: font,
              size: 0.08,  // Set desired size for text
              height: 0.05,  // Thickness
              curveSegments: 12,
            });


            const material = new THREE.MeshBasicMaterial({ color: 0xf9f7f3 });
            const textMesh = new THREE.Mesh(geometry, material);
            this.scene.add(textMesh);

            // Dynamically set the position of the textMesh
            textMesh.position.set(kiosk.position_x, 0.8, kiosk.position_y);
            textMesh.scale.z = -1;


          });
        }




        // Add kiosk mesh to clickable objects array
      });
      this.fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const geometry = new TextGeometry('Gym', { // Use kiosk name for dynamic text
          font: font,
          size: 0.5,  // Set desired size for text
          height: 0.05,  // Thickness
          curveSegments: 12,
        });

        const material = new THREE.MeshBasicMaterial({ color: 0x2f3e46 });
        const textMeshGym = new THREE.Mesh(geometry, material);
        this.scene.add(textMeshGym);

        // Dynamically set the position of the textMesh
        textMeshGym.position.set(1, 1.8, 1);
        textMeshGym.scale.z = -1;
      });
      this.fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const geometry = new TextGeometry('Field', { // Use kiosk name for dynamic text
          font: font,
          size: 0.5,  // Set desired size for text
          height: 0.05,  // Thickness
          curveSegments: 12,
        });

        const material = new THREE.MeshBasicMaterial({ color: 0x2f3e46 });
        const textMeshField = new THREE.Mesh(geometry, material);
        this.scene.add(textMeshField);

        // Dynamically set the position of the textMesh
        textMeshField.position.set(-1.5, 1.8, 0);
        textMeshField.scale.z = -1;
      });
    });

    this.loadModel('assets/model/map.glb');
  }



  private loadModel(path: string): void {
    const loader = new GLTFLoader();
    this.removeModel();
    loader.load(
      path,
      (gltf) => {
        this.currentModel = gltf.scene; // Store the new model reference
        this.scene.add(this.currentModel); // Add it to the scene
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the model:', error);
      }
    );
  }

  private removeModel(): void {
    if (this.currentModel) {
      this.scene.remove(this.currentModel); // Remove the model from the scene

      // Traverse and dispose of the model's resources
      this.currentModel.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.dispose(); // Dispose geometry
          }
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              if (material instanceof THREE.Material) {
                material.dispose(); // Dispose material
              }
            });
          } else if (child.material instanceof THREE.Material) {
            child.material.dispose(); // Dispose material
          }
        }
      });

      this.currentModel = undefined; // Clear the reference
    }
  }

  changeModel(path: string): void {
    this.removeModel();
    this.loadModel(path);
    this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 0.3, 8.6); // Camera starting position
    this.controls.minDistance = 5;
    this.controls.maxDistance = 30;

    // Adjust renderer properties
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0x404040); // Ambient light for basic illumination
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light for shading
    directionalLight.position.set(20, 20, 20).normalize();
    this.scene.add(directionalLight);
  }

  private onMouseClick(event: MouseEvent): void {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster with pointer position and camera
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.clickableObjects);
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      // Get the position of the clicked object
      const objectPositionY = clickedObject.position.y;
      const userData = clickedObject.userData as {
        name: string;
        eventsId: string;
        kioskId: string;
        kioskStatus: string;
        kioskDescription: string;
        kioskImage: string;
      };
      if (userData.kioskStatus == 'available') {
        const kioskId = userData.kioskId;
        const kioskName = userData.name;
        const eventsId = userData.eventsId;
        const kioskStatus = userData.kioskStatus;
        const kioskDescription = userData.kioskDescription;
        const kioskImage = userData.kioskImage;
        this.errorMessage = 'done';
        this.eventId = eventsId;
        this.kioskId = kioskId;
        this.kioskName = kioskName;
        this.kioskStatus = kioskStatus;
        this.kioskDescription = kioskDescription;
        this.kioskImage = kioskImage;
      }
      else {
        const kioskName = userData.name;
        this.kioskName = kioskName;
        this.errorMessage = 'occupied';
      }
    }
  }

  toApplication() {
    sessionStorage.setItem('kioskStatus', this.kioskStatus);
    sessionStorage.setItem('kioskName', this.kioskName);
    sessionStorage.setItem('kioskId', this.kioskId);
    this.router.navigate(['/application-form'])
  }

  ngAfterViewInit() {
    this.modelContainer.nativeElement.appendChild(this.renderer.domElement);
    this.animate();
  }

  private loadModelTerrain(): void {
    const loader = new GLTFLoader();
    loader.load(
      'assets/model/mapTerrain.glb',
      (gltf) => {
        this.model = gltf.scene;
        this.model.scale.set(1, 1, 1);
        this.model.position.set(0, 0, 0);
        this.scene.add(this.model);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the model:', error);
      }
    );
  }



  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy(): void {
    if (this.model) {
      this.scene.remove(this.model);
      this.model.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              if (material instanceof THREE.Material) {
                material.dispose();
              }
            });
          } else if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    const canvas = this.renderer.domElement;
    if (canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }

    if (this.controls) {
      this.controls.dispose();
    }
  }
}
