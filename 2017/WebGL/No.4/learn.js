window.onload = () => {
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
  camera.position.set(8,8,8);
  
  scene.add(camera);

  let imgLoader = new THREE.TextureLoader(); // THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead.
  let car_logo = imgLoader.load('./img/car_logo.jpg');
  let tyre_logo = imgLoader.load('./img/tyre_logo.jpg');

  loadMaterial = (material) => new THREE.MeshLambertMaterial({ // 材质很重要
    color: 0xffffff,
    map: material
  })
  let cube = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 2), loadMaterial(car_logo)) // 画车身
  let plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshPhongMaterial({ // 材质很重要
    color: 0x3b81e7,
  }))
  cube.position.set(0,1.5,0);
  cube.castShadow = true;
  cube.receiveShadow = false;

  plane.rotation.x = - Math.PI * 0.5;
  plane.position.y = -0.2;
  plane.receiveShadow = true;
  plane.castShadow = false;
  function drawTyre(r,w,posX,posY,posZ){ // 画轮胎
    let tyre = new THREE.Mesh(new THREE.TorusGeometry(r,w,18,18),loadMaterial(tyre_logo));
    tyre.position.set(posX,posY,posZ)
    tyre.castShadow = true;
    scene.add(tyre)
  }

  let light = new THREE.SpotLight(0xffffff, 1);
  light.position.set(2,5,5);
  light.castShadow = true;
  light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(45,1,1,10))
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

  scene.add(cube);
  scene.add(plane);
  scene.add(light); // 添加聚光源

  drawTyre(0.4,0.2,-1.2,0.3,1.1);
  drawTyre(0.4,0.2,1.2,0.3,1.1);
  drawTyre(0.4,0.2,1.2,0.3,-1.1);
  drawTyre(0.4,0.2,-1.2,0.3,-1.1);

  window.addEventListener('resize', onWindowResize, false); // 监听缩放

  function onWindowResize() {
    console.log(1);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
    render();
  }

  function animate(){
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