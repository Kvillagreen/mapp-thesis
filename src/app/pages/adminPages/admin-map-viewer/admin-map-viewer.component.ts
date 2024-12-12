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
import { AdminService } from '../../../services/rest-api/page-admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-map-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-map-viewer.component.html',
  styleUrl: './admin-map-viewer.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminMapViewerComponent implements OnChanges, DoCheck {
  kioskData: any[] = [];
  eventData: any[] = [];
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
  submitKiosk: string = '';
  kioskStatus: string = '';
  posx: number = 0;
  posy: number = 0;
  kioskDescription: string = '';
  kioskImage: string = '';
  mapTerrain: boolean = false;
  selectedEventId: string = '';
  selectedEventName: string = 'Select events';
  private currentModel: THREE.Object3D | undefined;
  kioskUploadImage: File | null = null;
  kioskUploadImageName: string = '';
  isModalOpen: boolean = false
  disable: boolean = false
  loading: boolean = false;
  kioskX: number = 0;
  kioskY: number = 0;
  myKiosk: any;
  addKiosk: boolean = false;
  submitted: boolean = false;
  @ViewChild('modelContainer', { static: true }) modelContainer!: ElementRef;

  constructor(public router: Router, private screenSizeService: ScreenSizeService, private adminService: AdminService) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.fontLoader = new FontLoader();

  }

  ngOnChanges(isMap: SimpleChanges): void {
  }
  goToDashBoard() {
    this.router.navigate(['/dashboard-admin'])
  }
  onEventSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedEventId = selectElement.value;
    sessionStorage.setItem('eventIdMap', this.selectedEventId);
    const selectedEvent = this.eventData.find(event => event.event_id === selectedEventId);

    if (selectedEvent) {
      const selectedEventName = selectedEvent.event_name;
      // You can store both values in sessionStorage or use them as needed
      sessionStorage.setItem('eventIdMap', selectedEventId);
      sessionStorage.setItem('eventNameMap', selectedEventName);
    }
    window.location.reload();
  }
  getEventName() {
    return sessionStorage.getItem('eventNameMap') ?? 'Select events';
  }

  getEvents() {
    this.adminService.getEvent().subscribe(
      (data: any[]) => {
        // Filter to store only event_name and event_id
        this.eventData = data.map(event => ({
          event_id: event.event_id,
          event_name: event.event_name
        }));
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  changeVal() {
    sessionStorage.setItem('submit', 'false');
    this.submitKiosk = 'false';
  }

  ngOnInit(): void {
    this.submitKiosk = sessionStorage.getItem('submit') ?? '';
    this.addClickListener();
    this.getEvents();

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
    const eventId = sessionStorage.getItem('eventIdMap') ?? '';
    this.adminService.getKioskMap(eventId).subscribe((data) => {
      this.kioskData = data;

      data.forEach((kiosk: any) => {
        // Create a box geometry for the kiosk
        const boxGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15); // Width, height, depth
        if (kiosk.status == 'available') {
          const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x52796f });
          // Create a Mesh for the kiosk box and set its position
          const kioskMesh = new THREE.Mesh(boxGeometry, boxMaterial);
          kioskMesh.position.set(kiosk.position_x, 0.65, kiosk.position_y);
          kioskMesh.userData = { name: kiosk.kiosk_name, eventId: kiosk.event_id, kioskId: kiosk.kiosk_id, kioskStatus: kiosk.status, kioskDescription: kiosk.kiosk_description, kioskImage: kiosk.kiosk_image, posx: kiosk.position_x, posy: kiosk.position_y }; // Attach kiosk name to the mesh

          this.scene.add(kioskMesh);
          this.clickableObjects.push(kioskMesh);
        }
        else if (kiosk.status == 'pending') {

          const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
          // Create a Mesh for the kiosk box and set its position
          const kioskMesh = new THREE.Mesh(boxGeometry, boxMaterial);
          kioskMesh.position.set(kiosk.position_x, 0.65, kiosk.position_y);
          kioskMesh.userData = { name: kiosk.kiosk_name, eventId: kiosk.event_id, kioskId: kiosk.kiosk_id, kioskStatus: kiosk.status, kioskDescription: kiosk.kiosk_description, kioskImage: kiosk.kiosk_image, posx: kiosk.position_x, posy: kiosk.position_y }; // Attach kiosk name to the mesh

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
          kioskMesh.userData = { name: kiosk.kiosk_name, eventId: kiosk.event_id, kioskId: kiosk.kiosk_id, kioskStatus: kiosk.status, kioskDescription: kiosk.kiosk_description, kioskImage: kiosk.kiosk_image, kiosk, posx: kiosk.position_x, posy: kiosk.position_y }; // Attach kiosk name to the mesh

          this.scene.add(kioskMesh);
          this.clickableObjects.push(kioskMesh);
        }
        else {
          const boxMaterial = new THREE.MeshBasicMaterial({
            color: 0x1b263b
          });
          // Create a Mesh for the kiosk box and set its position
          const kioskMesh = new THREE.Mesh(boxGeometry, boxMaterial);
          kioskMesh.position.set(kiosk.position_x, 0.65, kiosk.position_y);
          kioskMesh.userData = { name: kiosk.kiosk_name, eventId: kiosk.event_id, kioskId: kiosk.kiosk_id, kioskStatus: kiosk.status, kioskDescription: kiosk.kiosk_description, kioskImage: kiosk.kiosk_image, kiosk, posx: kiosk.position_x, posy: kiosk.position_y }; // Attach kiosk name to the mesh

          this.scene.add(kioskMesh);
          this.clickableObjects.push(kioskMesh);
        }


        // Load the font and create TextGeometry
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

    if (intersects.length > 0 && !this.addKiosk) {
      const clickedObject = intersects[0].object;

      // Get the position of the clicked object
      const objectPositionY = clickedObject.position.y;

      const userData = clickedObject.userData as {
        name: string;
        eventId: string;
        kioskId: string;
        kioskStatus: string;
        kioskDescription: string;
        kioskImage: string;
        posx: number;
        posy: number;
      };
      const kioskId = userData.kioskId;
      const kioskName = userData.name;
      const eventId = userData.eventId;
      const kioskStatus = userData.kioskStatus;
      const kioskDescription = userData.kioskDescription;
      const kioskImage = userData.kioskImage;
      const posx = userData.posx;
      const posy = userData.posy;
      this.errorMessage = 'done';
      this.eventId = eventId;
      this.kioskId = kioskId;
      this.kioskName = kioskName;
      this.kioskStatus = kioskStatus;
      this.kioskDescription = kioskDescription;
      this.kioskImage = kioskImage;
      this.posx = posx;
      this.posy = posy;

    }
  }


  addClickListener(): void {
    // Attach click event listener only to the modelContainer
    this.modelContainer.nativeElement.addEventListener('click', (event: MouseEvent) => this.onMouseClick(event));
  }
  ngAfterViewInit() {
    if (this.modelContainer && this.modelContainer.nativeElement) {
      this.modelContainer.nativeElement.appendChild(this.renderer.domElement);
      this.animate();
    } else {
      console.error('Model container not found.');
    }
  }


  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  ngDoCheck(): void {// Create the new kiosk geometry and material
    if (this.addKiosk) {
      const newBoxGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
      const newBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x5e503f });
      const newKiosk = new THREE.Mesh(newBoxGeometry, newBoxMaterial);
      newKiosk.position.set(this.posx, 0.65, this.posy);
      this.posx = this.kioskX;
      this.posy = this.kioskY;
      //1.8 max buttom ; -2.6  max top ; 5 max right ; -3.5 max left 
      if (this.myKiosk) {
        this.scene.remove(this.myKiosk);
      }
      this.scene.add(newKiosk);
      this.myKiosk = newKiosk;
    }
    else {
      this.scene.remove(this.myKiosk);
    }

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

  openModal(event: any) { // Copy the selected event data
    this.isModalOpen = true;
  }

  // Function to close the modal
  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    if (this.submitted) {
      const formData = new FormData();
      // Append form data (strings and numbers)
      formData.append('kioskId', this.kioskId);
      formData.append('kioskName', this.kioskName);
      formData.append('posx', this.posx.toString());
      formData.append('posy', this.posy.toString());
      formData.append('kioskDescription', this.kioskDescription);
      formData.append('status', this.kioskStatus);

      // Check if image file exists and append it to the FormData
      if (this.kioskUploadImage) {
        formData.append('kioskUploadImage', this.kioskUploadImage, this.kioskUploadImage.name);
      }
      this.loading = true;
      // Call service method to update the event
      this.adminService.updateKiosk(formData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            sessionStorage.setItem('submit', 'true');
            this.closeModal();
            this.kioskId = '';
            this.kioskName = '';
            this.kioskDescription = '';
            this.posx = 0;
            this.posy = 0;
            this.kioskStatus = '';
            this.kioskUploadImage = null;
            this.kioskUploadImageName = '';
            window.location.reload();
          }
        },
        error: (error) => {
          this.errorMessage = 'Error submitting the application. Please try again.';
          console.error(error);
        }
      });

    }
    // Close the modal after submission
  }

  onFileChange(event: Event): void {
    this.isModalOpen = true;
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.kioskUploadImage = target.files[0]; // Set the selected file
      this.kioskUploadImageName = this.kioskUploadImage.name; // Optionally store the file name
    }
  }

}
