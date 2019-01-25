/////////FUNCTIONS TEMPLE///////////

function makeTemple(size,sizediff,hauteur,posx,posz){
  var texture = new THREE.TextureLoader().load('images/templeMousse.jpg');
  var material = new THREE.MeshPhongMaterial( { map: texture, dithering: true } );
  var geometry = new THREE.BoxBufferGeometry( size, hauteur, size );
  var base = new THREE.Mesh( geometry, material );
  base.position.set( posx, 10, posz );
  base.castShadow = true;
  baseTemple(1,base,size,sizediff,hauteur,posx,posz);

  var hypothenuse = Math.sqrt(Math.pow(hauteur * 9,2) + Math.pow(sizediff * 4,2));
  var geometry = new THREE.BoxBufferGeometry( 10, hypothenuse, size/6 );
  var rampe = new THREE.Mesh( geometry, material );
  rampe.position.set(posx + (size - (4*sizediff))/2, hauteur * 4, posz );
  var angle = Math.acos((sizediff * 4) / hypothenuse)- Math.PI/4 - 5*(Math.PI/180);
  //	var angle = Math.acos((sizediff * 4) / hypothenuse)/2;
  rampe.rotation.set(0, 0, angle - 0.1);
  rampe.castShadow = true;
  escalierTemple(1,rampe,size,sizediff,hauteur,posx,posz);
  hautTemple(size,sizediff,hauteur,posx,posz);
}

function baseTemple(it,base,size,sizediff,hauteur,posx,posz){
  scene.add( base );
  if(it < 9){
    var texture = new THREE.TextureLoader().load('images/templeMousse.jpg');
    var material = new THREE.MeshPhongMaterial( { map: texture, dithering: true } );
    var geometry = new THREE.BoxBufferGeometry( size-sizediff, hauteur, size-sizediff );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( posx, hauteur * it + 10, posz );
    mesh.castShadow = true;
    baseTemple(it+1,mesh,size-sizediff,sizediff,hauteur,posx,posz);
  }
}

function escalierTemple(it,rampe,size,sizediff,hauteur,posx,posz){
  scene.add( rampe );
  if(it < 4){
    var texture = new THREE.TextureLoader().load('images/templeMousse.jpg');
    var material = new THREE.MeshPhongMaterial( { map: texture, dithering: true } );
    var hypothenuse = Math.sqrt(Math.pow(hauteur * 9,2) + Math.pow(sizediff * 4,2));
    var geometry = new THREE.BoxBufferGeometry( 10, hypothenuse, size/6 );
    var mesh = new THREE.Mesh( geometry, material );
    if(it == 1){
      var x = (-size + (4*sizediff))/2 + posx;
      rotx = 0;
    }
    else if(it == 2){
      var x = posx;
      var rotx = Math.PI / 2;
      posz = (size - (4*sizediff))/2 + posz;
    }
    else{
      var x = posx;
      var rotx = -Math.PI / 2;
      posz = posz - size + sizediff * 4;
    }
    mesh.position.set(x, hauteur * 4, posz );
    var angle = Math.acos((sizediff * 4) / hypothenuse) - Math.PI/4 + -5*(Math.PI/180);
    mesh.rotation.set(0, rotx, -angle + 0.1);
    mesh.castShadow = true;
    escalierTemple(it+1,mesh,size,sizediff,hauteur,posx,posz);
  }
}


function hautTemple(size,sizediff,hauteur,posx,posz){
  var texture = new THREE.TextureLoader().load('images/templeMousse.jpg');
  var material = new THREE.MeshPhongMaterial( { map: texture, dithering: true } );
  var geometry = new THREE.BoxBufferGeometry( size - (10 * sizediff), hauteur * 3, size - (10 * sizediff));
  var haut = new THREE.Mesh( geometry, material );
  haut.position.set( posx, hauteur * 9 + 10, posz );
  haut.castShadow = true;
  scene.add(haut);
}
