function skyBox(){
  var geometry = new THREE.CubeGeometry( 50000, 50000, 50000);
  var cubeMaterials =
  [ //On peut mettre DoubleSide
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/skybox.jpg' ), side:THREE.BackSide } ), // droite
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/skybox.jpg' ), side:THREE.BackSide } ), // gauche
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/skybox.jpg' ), side:THREE.BackSide } ), //Haut
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/skybox.jpg' ), side:THREE.BackSide } ), //Bas
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/skybox.jpg' ), side:THREE.BackSide } ),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/skybox.jpg' ), side:THREE.BackSide } )
  ];
  var cubeMaterial = new THREE.MeshBasicMaterial( cubeMaterials );
  var skybox = new THREE.Mesh ( geometry, cubeMaterials );
  scene.add( skybox );
}

function makeFloor(path,size,finalSize){
  var floorGeometry = new THREE.PlaneGeometry(size, size);
  floorGeometry.rotateX( - Math.PI / 2 );
  var floorTexture = new THREE.TextureLoader().load(path);
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture } );
  var floor = new THREE.Mesh( floorGeometry, floorMaterial );

  var i;
  var j;
  for(j = 0; j*size < finalSize/2;j++)
  {
    for(i = 0;i*size < finalSize/2;i++){
        var flooor = floor.clone();
        flooor.position.set(size*i,0,j*size);
        scene.add(flooor);
    }
    for(i = 0;i*size < finalSize/2;i++){
        var flooor = floor.clone();
        flooor.position.set(-size*i,0,j*size);
        scene.add(flooor);
    }
  }
  for(j = 0; j*size < finalSize/2;j++)
  {
    for(i = 0;i*size < finalSize/2;i++){
        var flooor = floor.clone();
        flooor.position.set(size*i,0,j*-size);
        scene.add(flooor);
    }
    for(i = 0;i*size < finalSize/2;i++){
        var flooor = floor.clone();
        flooor.position.set(-size*i,0,j*-size);
        scene.add(flooor);
    }
  }
}
