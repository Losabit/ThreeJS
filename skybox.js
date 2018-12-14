var geometry = new THREE.CubeGeometry( 50000, 50000, 50000);
var cubeMaterials =
[ //On peut mettre DoubleSide
  new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'img/img.jpg' ), side:THREE.BackSide } ), // droite
  new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'img/img.jpg' ), side:THREE.BackSide } ), // gauche
  new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'img/img.jpg' ), side:THREE.BackSide } ), //Haut
  new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'img/img.jpg' ), side:THREE.BackSide } ), //Bas
  new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'img/img.jpg' ), side:THREE.BackSide } ),
  new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'img/img.jpg' ), side:THREE.BackSide } )
];

var cubeMaterial = new THREE.MeshBasicMaterial( cubeMaterials );
var skybox = new THREE.Mesh ( geometry, cubeMaterials );
skybox.position.set(0, 0, 0);
scene.add( skybox );
