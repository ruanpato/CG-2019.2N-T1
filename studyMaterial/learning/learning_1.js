var group = new THREE.Group();
scene.add( group );

group.add( mesh1 );
group.add( mesh2 );

mesh2.visible = false;
group.remove( mesh2 );

group.children // mesh1
group.parent // scene