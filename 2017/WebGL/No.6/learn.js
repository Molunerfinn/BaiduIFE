window.onload = () => {

  let stats = new Stats(); // 监听帧率
  stats.showPanel(0);
  document.body.appendChild( stats.domElement ); 

  let requestAnimationFrame = window.requestAnimationFrame 
          || window.mozRequestAnimationFrame
          || window.webkitRequestAnimationFrame
          || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  let renderer = new THREE.WebGLRenderer({ // 渲染器
    canvas: document.getElementById('canvas'),
    antialias: true,
    precision: "highp",
  })
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.soft = true;
  renderer.setClearColor(0x000000);
  let scene = new THREE.Scene(); // 场景
  let camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000); // 照相机
  camera.position.set(80,80,80);
  
  scene.add(camera);

  let mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('./src/');
  mtlLoader.load('fll.mtl', (materials) => {
    materials.preload();

    let objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('./src/');
    objLoader.load('fll.obj', (obj) => {
      console.log(obj);
      obj.position.y = 0;
      obj.position.x = 0;
      obj.position.z = 0;
      obj.scale.set(0.1,0.1,0.1);
      obj.castShadow = true;
      if (obj.children.length > 0) {
        scene.add(obj)
      }
    })
  })

  let plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ // 材质很重要
    color: 0x3b81e7,
  }))

  plane.rotation.x = - Math.PI * 0.5;
  plane.position.y = -0.2;
  plane.receiveShadow = true;
  plane.castShadow = false;

  let light = new THREE.SpotLight(0xffffff, 1);
  light.position.set(0,70,70);
  light.castShadow = true;
  light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(45,1,1,100))
  let helper = new THREE.CameraHelper( light.shadow.camera );
  scene.add(helper);
  light.shadowCameraVisibel = true;

  let controls = new THREE.TrackballControls(camera); // 采用TrackballContorls
  controls.rotateSpeed = 10;
  controls.zoomSpeed = 2;
  controls.panSpeed = 1.2;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [ 65, 83, 68 ];
  controls.addEventListener( 'change', render ); 

  scene.add(plane);
  scene.add(light);

  function animate(){
    stats.begin();
    stats.end();
    requestAnimationFrame(animate);
    controls.update(); // controls要更新
    render(); 
  }
  function render() {
    camera.lookAt(new THREE.Vector3(0,0,0));
    renderer.render(scene, camera); // 渲染
  }
  animate();
}