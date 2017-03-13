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
  camera.position.set(-10,10,0);
  camera.lookAt(new THREE.Vector3(1,10,10))
  
  scene.add(camera);

  let imgLoader = new THREE.TextureLoader(); // THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead.
  let car_logo = imgLoader.load('./img/car_logo.jpg');
  let tyre_logo = imgLoader.load('./img/tyre_logo.jpg');

  loadMaterial = (material) => new THREE.MeshLambertMaterial({ // 材质很重要
    color: 0xffffff,
    map: material
  })
  let cube = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 2), loadMaterial(car_logo)) // 画车身
  let plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 12), new THREE.MeshPhongMaterial({ // 材质很重要
    color: 0x3b81e7,
  }))
  cube.position.set(0,1.5,0);
  cube.castShadow = true;
  cube.receiveShadow = false;

  plane.rotation.x = - Math.PI * 0.5;
  plane.position.x = 3;
  plane.position.y = -0.2;
  plane.receiveShadow = true;
  plane.castShadow = false;
  let tyres = [];
  function drawTyre(r,w,posX,posY,posZ){ // 画轮胎
    let tyre = new THREE.Mesh(new THREE.TorusGeometry(r,w,18,18),loadMaterial(tyre_logo));
    tyre.position.set(posX,posY,posZ)
    tyre.castShadow = true;
    cube.add(tyre); // 把轮胎加入车身，随车身移动。也就是放到一组里
    tyres.push(tyre);
  }

  let light = new THREE.SpotLight(0xffffff, 1);
  light.position.set(-5,6,0);
  light.castShadow = true;
  light.target = cube;
  light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(45,1,1,20))
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

  drawTyre(0.4,0.2,-1.2,-1.2,1.1);
  drawTyre(0.4,0.2,1.2,-1.2,1.1);
  drawTyre(0.4,0.2,1.2,-1.2,-1.1);
  drawTyre(0.4,0.2,-1.2,-1.2,-1.1);

  document.onkeydown = (e) => {
    let ev = e || window.event;
    let speed = 0.2;
    let r = Math.sqrt(3.25);
    switch(ev.keyCode){
      case 87: // w
        cube.position.x += speed * Math.cos(cube.rotation.y);
        cube.position.z -= speed * Math.sin(cube.rotation.y);
        plane.position.x += speed * Math.cos(cube.rotation.y);
        light.position.x += speed * Math.cos(cube.rotation.y);
        // camera.position.x += speed * Math.cos(cube.rotation.y);
        // camera.lookAt(new THREE.Vector3(cube.position.x - 1.5, cube.position.y - 1, cube.position.z - 1))
        // console.log(camera.position,cube.position);
        for(let i of tyres){
          i.rotation.z += Math.PI * speed;
        }
      break;
      case 65: // a
        cube.rotation.y += Math.PI * speed * 0.1;
      break;
      case 83: // s
        cube.position.x -= speed * Math.cos(cube.rotation.y);
        cube.position.z += speed * Math.sin(cube.rotation.y);
        plane.position.x -= speed * Math.cos(cube.rotation.y);
        light.position.x -= speed * Math.cos(cube.rotation.y);
        for(let i of tyres){
          i.rotation.z -= Math.PI * speed;
        }
      break;
      case 68: // d
        cube.rotation.y -= Math.PI * speed * 0.1;
      break;
    }
  };

  function animate(){
    stats.begin();
    stats.end();
    requestAnimationFrame(animate);
    controls.target = new THREE.Vector3(cube.position.x - 1.5, cube.position.y - 1, cube.position.z - 1);
    controls.update(); // controls要更新
    render(); 
  }
  function render() {
    camera.lookAt(new THREE.Vector3(0,0,0));
    renderer.render(scene, camera); // 渲染
  }
  animate();
}