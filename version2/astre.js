function makeSun(posx, posy, posz){
  var texture = new THREE.TextureLoader().load('images/sun.jpg');
  var geometry = new THREE.SphereBufferGeometry(200, 200, 200);
  var material = new THREE.MeshPhongMaterial({ map: texture});
  meshSun = new THREE.Mesh(geometry, material);
  meshSun.position.set(posx, posy, posz);
  scene.add(meshSun);

  spotLightSun = new THREE.SpotLight( 0xffffff, 2.5 );
  spotLightSun.position.set( posx, posy, posz );
  spotLightSun.angle = Math.PI / 4;
  spotLightSun.penumbra = 0.05;
  spotLightSun.decay = 2;
  spotLightSun.distance = 6000;
  spotLightSun.castShadow = true;
  spotLightSun.shadow.mapSize.width = 1024;
  spotLightSun.shadow.mapSize.height = 1024;
  spotLightSun.shadow.camera.near = 10;
  spotLightSun.shadow.camera.far = 200;
  scene.add( spotLightSun );
}

function makeMoon(posx, posy, posz){
  var texture = new THREE.TextureLoader().load('images/moon.jpg');
  var geometry = new THREE.SphereBufferGeometry(200, 200, 200);
  var material = new THREE.MeshPhongMaterial({ map: texture});
  meshMoon = new THREE.Mesh(geometry, material);
  meshMoon.position.set(posx, posy, posz);
  scene.add(meshMoon);

  spotLightMoon = new THREE.SpotLight( 0xffffff, 0.5 );
  spotLightMoon.position.set( posx, posy, posz );
  spotLightMoon.angle = Math.PI / 4;
  spotLightMoon.penumbra = 0.05;
  spotLightMoon.decay = 2;
  spotLightMoon.distance =  5000;
  spotLightMoon.castShadow = true;
  spotLightMoon.shadow.mapSize.width = 1024;
  spotLightMoon.shadow.mapSize.height = 1024;
  spotLightMoon.shadow.camera.near = 10;
  spotLightMoon.shadow.camera.far = 200;
  scene.add( spotLightMoon );
}
