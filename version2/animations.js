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
        avatar.position.set(posx, posy, posz);
        avatar.rotation.y+=5;
        var action = mixer.clipAction( animations[ 0 ] ).play();
        scene.add( avatar );
      } );
}

function makewolf(posx, posy, posz){
  var loadw = new THREE.ColladaLoader();
  loadw.load( 'collada/wolf.dae', function ( collada ) {
    var animationsw = collada.animations;
    var avatarw = collada.scene;
    avatarw.traverse( function ( node ) {
      if ( node.isSkinnedMesh ) {
        node.frustumCulled = false;
      }
    } );
    mixer2 = new THREE.AnimationMixer( avatarw );
    avatarw.scale.set(30, 30, 30);
    avatarw.position.set(posx, posy, posz);
    var actionw = mixer2.clipAction( animationsw[ 0 ] ).play();
    scene.add( avatarw );
  } );
}

function render() {
  var delta = clock.getDelta();
  if ( mixer !== undefined ) {
    mixer.update( delta );
    mixer2.update(delta);
  }
  renderer.render( scene, camera );
}
