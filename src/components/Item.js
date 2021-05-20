import * as THREE from 'three'
import frag from './shaders/standard.frag'
import vert from './shaders/varying.vert'
import {TextureTypeEnum, sceneOptions} from '../configs/config'

export default class Item extends THREE.Group {

    constructor( opts = { mainSpace, texture, positionId, type, data, step, zPosition, overridePos : false, nextStepLocation } ) {
    
        super()
        Object.assign( this, opts )

        this.init()

    }

    init() {

        this.uniforms = {
            time: { type: 'f', value: 1.0 },
            fogColor: { type: "c", value: this.mainSpace.scene.fog.color },
            fogNear: { type: "f", value: this.mainSpace.scene.fog.near },
            fogFar: { type: "f", value: this.mainSpace.scene.fog.far },
            texture: { type: 't', value: this.texture },
            opacity: { type: 'f', value: 1.0 },
            progress: { type: 'f', value: 0 },
            gradientColor: { type: 'vec3', value: new THREE.Color(0xffffff) }
        }

        if(this.overridePos)
            this.uniforms.progress.value = 1;

        this.geometry = new THREE.PlaneGeometry( 1, 1 )
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: frag,
            vertexShader: vert,
            fog: true,
            transparent: true
        })

        this.mesh = new THREE.Mesh( this.geometry, this.material )
        this.mesh.scale.set( this.texture.size.x, this.texture.size.y, 1 )

        this.texture.onUpdate = () => {
            if( this.mesh.scale.x !== this.texture.size.x && this.mesh.scale.y !== this.texture.size.y ) {
                if(overridePos)
                    this.mesh.scale.set( this.texture.size.x * 2, this.texture.size.y * 2, 1 )
                else
                    this.mesh.scale.set( this.texture.size.x, this.texture.size.y, 1 )
                this.texture.onUpdate = null
            }
        }

        if(this.texture.mediaType === "video" && this.overridePos)
            this.material.uniforms.texture.value.image.play()


        let align = this.positionId, pos = new THREE.Vector2()
        if(align || align === 0){
            if( align === 0 ) pos.set( -1 * sceneOptions.xPovit, sceneOptions.yPovit) // top left
            else if( align === 7 ) pos.set(  0, sceneOptions.yPovit) // top center 
            else if( align === 1 ) pos.set(  sceneOptions.xPovit, sceneOptions.yPovit) //  top right
            else if( align === 2 ) pos.set(  sceneOptions.xPovit, -1 * sceneOptions.yPovit) // bottom right
            else if( align === 8 ) pos.set(  0, -1 * sceneOptions.yPovit ) // bottom center
            else if( align === 3 ) pos.set( -1 * sceneOptions.xPovit, -1 * sceneOptions.yPovit) // bottom left
            else if( align === 4 ) pos.set( -1 * sceneOptions.xPovit, 0) // middle left
            else if( align === 5 ) pos.set(  sceneOptions.xPovit, 0) // middle Right
            else if( align === 6 ) pos.set(  0, 0 ) // middle center
        }

        this.align = align;
        let roadBlockOffset = (this.type === TextureTypeEnum.roadBlock) ? 200 : 0;
        this.position.set( pos.x, pos.y, ( -1 * (this.zPosition + roadBlockOffset) ) );
        this.targetPos = new THREE.Vector3( this.position.x, this.position.y, this.position.z ); 
        if(this.overridePos && this.overridePos.x ){
            pos.set(  this.overridePos.x, this.overridePos.y ) // OverRidePos
            this.position.set( pos.x, pos.y, ( -1 * (this.zPosition) ));
        }


        this.origPos = new THREE.Vector2( pos.x, pos.y );
        this.add( this.mesh )

        this.addImageText();

        if(this.type === TextureTypeEnum.roadBlock ) {
            this.addVideoButton();
        }

        if(!this.overridePos){
            this.mainSpace.itemMeshes.push( this.mesh );
            this.addImageCap()
        }else{
            this.addGridText()
        }

        if( this.texture.mediaType === 'video' ) {
            this.mainSpace.videoItems.push( this.mesh )
        }

        // || this.type === TextureTypeEnum.video
    }
    addVideoButton () {
        let isRoadBlock = (this.type === TextureTypeEnum.roadBlock) ? true : false;
        let linkGroup = new THREE.Group()
        // let linkGeom = new THREE.TextGeometry( 'Click to play', {
        //     font: this.mainSpace.assets.fonts['HelveticaNeue'],
        //     size: 7,
        //     height: 0,
        //     curveSegments: 6
        // } ).center()
        // let link = new THREE.Mesh( linkGeom, this.mainSpace.textMat )
        // link.position.set( -7, -0, 0 )

        // for raycasting so it doesn't just pick up on letters
        this.videoBox = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 700, 300 ),
            new THREE.MeshBasicMaterial( { alphaTest: 0, visible: false } )
        )
        this.videoBox.onClick = () => {
            // show html page from here
            if(!this.data.videoData.videoId || !this.data.videoData.videoType || !this.data.videoData.mode ) throw new Error("Need to Add VideoData")
            openModal(this.data.videoData);
            //console.log("video ID", this.texture.name);
            //console.log("video Type", "Local");

            if(isRoadBlock){
                this.mainSpace.c.scrollPos = this.zPosition + (this.nextStepLocation * -1) + 1100;
                this.mainSpace.refresh();
                //get Ready with next roadBlock
                this.mainSpace.adjustNextRoadBlock();
            }
        }

        let borderTexture = new THREE.TextureLoader().load( 'assets/playVideo.png' )
            borderTexture.magFilter = borderTexture.minFilter = THREE.LinearFilter
        let borderMaterial = new THREE.MeshBasicMaterial( { map: borderTexture, transparent: true, depthWrite: false } )
        let borderGeom = new THREE.PlaneGeometry( 1, 1 )
        this.border = new THREE.Mesh( borderGeom, borderMaterial )
        this.border.scale.set( 30, 40, 1 )

        linkGroup.add( this.border )
        linkGroup.add( this.videoBox )
        // linkGroup.add(link);

        linkGroup.position.set( this.origPos.x, this.origPos.y, 100 )
        this.add( linkGroup )
        this.mainSpace.itemMeshes.push( this.videoBox );

        if(this.data.caption === '') return

        let textGeom = new THREE.TextGeometry( this.data.caption, {
            font: this.mainSpace.assets.fonts['TimesNewRomanPSMT'],
            size: 24,
            height: 0,
            curveSegments: 4
        } ).center()
        let textMesh = new THREE.Mesh( textGeom, this.mainSpace.textMat )
        textMesh.position.set(0,-55, 20)
        this.add( textMesh )

    }
    
    addImageText() {
        if( !this.data.text || !this.data.text.length > 0 ) return

        let startY= this.data.text.length * 23;

        for (let i = 0; i < this.data.text.length; i++) {
            let text = this.data.text[i];

            let textGeom = new THREE.TextGeometry( text, {
                font: this.mainSpace.assets.fonts['TimesNewRomanPSMT'],
                size: 24,
                height: 0,
                curveSegments: 4
            } ).center()

            let textMesh = new THREE.Mesh( textGeom, this.mainSpace.textMat )
            textMesh.position.set(0,startY, - 750)
            textMesh.position.x -= this.origPos.x;
            textMesh.position.y -= this.origPos.y;

            this.add( textMesh )
            startY -= 45; //test height
        }
        this.zPosition += 850; //for text Offset
    }
    addGridText () {
        // if( this.data.caption.length <= 0 ) return

        this.gridTexts = [];
        let startY= 35;

        for (let i = 0; i < this.data.caption.length; i++) {
            let text = this.data.caption[i];

            let textGeom = new THREE.TextGeometry( text, {
                font: this.mainSpace.assets.fonts['HelveticaNeue'],
                size: 12,
                height: 0,
                curveSegments: 4
            } ).center()

            let textMesh = new THREE.Mesh( textGeom, this.mainSpace.textMat )
                textMesh.position.set( 0, -this.mesh.scale.y / 2 - startY, 0 )
            this.add( textMesh )
            startY += 25; //test height

            this.gridTexts.push(textMesh);
        }
        
    }
    addImageCap() {

        if( this.data.caption === '' && this.data.link === '' ) return
        
        if( this.data.caption !== '' ) {
            let captionGeom = new THREE.TextGeometry( this.data.caption, {
                font: this.mainSpace.assets.fonts['TimesNewRomanPSMT'],
                size: 12,
                height: 0,
                curveSegments: 6
            } ).center()

            this.caption = new THREE.Mesh( captionGeom, this.mainSpace.captionTextMat )
            this.caption.position.set( 0, -this.mesh.scale.y / 2 - 50, 0 )
            this.caption.visible = false
            this.add( this.caption )
        }
        //
        if( this.data.copyRight && this.data.copyRight !== '' ) {
            let copyRightGeom = new THREE.TextGeometry( this.data.copyRight, {
                font: this.mainSpace.assets.fonts['TimesNewRomanPSMT'],
                size: 12,
                height: 0,
                curveSegments: 6
            } ).center()

            this.copyRight = new THREE.Mesh( copyRightGeom, this.mainSpace.alphaTextMat )
            this.copyRight.position.set( 0, -this.mesh.scale.y / 2 - 80, 0 )
            this.copyRight.visible = false
            this.add( this.copyRight )
        }

        if( this.data.link !== '' ) {

            this.linkGroup = new THREE.Group()
            let linkGeom = new THREE.TextGeometry( 'SEE MORE', {
                font: this.mainSpace.assets.fonts['HelveticaNeue'],
                size: 6,
                height: 0,
                curveSegments: 6
            } ).center()

            this.link = new THREE.Mesh( linkGeom, this.mainSpace.captionTextMat )

            this.linkUnderline = new THREE.Mesh(
                new THREE.PlaneBufferGeometry( 45, 1 ),
                this.mainSpace.linkUnderlineMat
            )
            this.linkUnderline.position.set( 0, -10, 0 )

            // for raycasting so it doesn't just pick up on letters
            this.videoBox = new THREE.Mesh(
                new THREE.PlaneBufferGeometry( 900, 500 ),
                new THREE.MeshBasicMaterial( { alphaTest: 0, visible: false } )
            )
            this.videoBox.onClick = () => {
                window.open( this.data.link, '_blank' )
            }

            this.linkGroup.position.set( 0, this.caption ? this.caption.position.y - 40  : -this.mesh.scale.y / 2 - 50, 0 )
            this.linkGroup.visible = false

            this.linkGroup.add( this.link )
            this.linkGroup.add( this.linkUnderline )
            this.linkGroup.add( this.videoBox )
            this.add( this.linkGroup )
        }
    }
    showVideo(){
        // show html page from here
        if(!this.data.videoData.videoId || !this.data.videoData.videoType || !this.data.videoData.mode ) throw new Error("Need to Add VideoData")
        openModal(this.data.videoData);
    }
    // addVideoButton () {
    //     let isRoadBlock = (this.type === TextureTypeEnum.roadBlock) ? true : false;
        
    //     let linkGroup = new THREE.Group()
    //     let linkGeom = new THREE.TextGeometry( 'Play Video', {
    //         font: this.mainSpace.assets.fonts['HelveticaNeue'],
    //         size: 30,
    //         height: 0,
    //         curveSegments: 6
    //     } ).center()

    //     let link = new THREE.Mesh( linkGeom, this.mainSpace.textMat )
    //     let linkUnderline = new THREE.Mesh(
    //         new THREE.PlaneBufferGeometry( 150, 10 ),
    //         this.mainSpace.linkUnderlineMat
    //     )
    //     linkUnderline.position.set( 0, -25, 0 )

    //     // for raycasting so it doesn't just pick up on letters
    //     this.videoBox = new THREE.Mesh(
    //         new THREE.PlaneBufferGeometry( 140, 30 ),
    //         new THREE.MeshBasicMaterial( { alphaTest: 0, visible: false } )
    //     )
    //     this.videoBox.onClick = () => {
    //         // show html page from here
    //         if(!this.data.videoData.videoId || !this.data.videoData.videoType || !this.data.videoData.mode ) throw new Error("Need to Add VideoData")
    //         openModal(this.data.videoData);
    //         //console.log("video ID", this.texture.name);
    //         //console.log("video Type", "Local");

    //         if(isRoadBlock){
    //             //get Ready with next roadBlock
    //             this.mainSpace.adjustNextRoadBlock();
    //         }
    //     }

    //     linkGroup.position.set( this.origPos.x, this.origPos.y, 100 )

    //     linkGroup.add( link )
    //     linkGroup.add( linkUnderline )
    //     linkGroup.add( this.videoBox )
    //     this.add( linkGroup )
    //     this.mainSpace.itemMeshes.push( this.videoBox );
    // }

}