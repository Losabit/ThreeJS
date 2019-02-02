function makeBelly(posx, posy, posz){
      var loade = new THREE.ColladaLoader();
      loade.load( 'collada/belly.dae', function ( collada ) {
        var animations = collada.animations;
        var avatar = collada.scene;
        avatar.traverse( function ( node ) {
          if ( node.isSkinnedMesh ) {
            node.frustumCulled = false;
          }
        } );
        mixer = new THREE.AnimationMixer( avatar );
        avatar.scale.set(0.2,0.2,0.2);
        avatar.position.set(-50, 0, -240);
        avatar.rotation.y += 5;
        var action = mixer.clipAction( animations[ 0 ] ).play();
        scene.add( avatar );
      } );
}

function makewolf(posx, posy, posz){
  var loadw = new THREE.ColladaLoader();
  loadw.load( 'collada/wolf.dae', function ( collada ) {
    var animations = collada.animations;
    var avatar = collada.scene;
    avatar.traverse( function ( node ) {
      if ( node.isSkinnedMesh ) {
        node.frustumCulled = false;
      }
    } );
    mixer2 = new THREE.AnimationMixer( avatar );
    avatar.scale.set(30, 30, 30);
    avatar.position.set(posx, posy, posz);
    var actionw = mixer2.clipAction( animations[ 0 ] ).play();
    scene.add( avatar );
  } );
}
function makespider(posx, posy, posz){
  var loadw = new THREE.ColladaLoader();
  loadw.load( 'collada/spider.dae', function ( collada ) {
    var animations = collada.animations;
    var avatar = collada.scene;
    avatar.traverse( function ( node ) {
      if ( node.isSkinnedMesh ) {
        node.frustumCulled = false;
      }
    } );
    mixer3 = new THREE.AnimationMixer( avatar );
    avatar.scale.set(0.5, 0.5, 0.5);
    avatar.rotation.z += 5;
    avatar.position.set(posx, posy, posz);
    var actionw = mixer3.clipAction( animations[ 1 ] ).play(); //Faire pop l'areignée : mettre sur 0
    scene.add( avatar );
  } );
}


function render() {
  var delta = clock.getDelta();
  if ( mixer !== undefined ) {
    mixer.update( delta );
    mixer2.update(delta);
    mixer3.update(delta);
  }
  renderer.render( scene, camera );
}
