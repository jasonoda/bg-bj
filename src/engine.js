import * as THREE from 'three';

import AES from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8';

export default class Engine{
    constructor(input, loader, scene, sounds, utilities, ui, endScore){

        this.input = input;
        this.loader = loader;
        this.s = sounds;
        this.scene = scene;
        this.ui = ui;
        this.u = utilities;
        this.endScore = endScore;

        this.mobile = false;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) || window.innerWidth<600) {
            this.mobile = true;
        }

        var testUA = navigator.userAgent;

        if(testUA.toLowerCase().indexOf("android") > -1){
            this.mobile = true;
        }

        // Hide side blockers on tablets (UA-based detection, no measurements)
        try {
            const ua = navigator.userAgent || navigator.vendor || (window.opera ? window.opera : "");
            const isIPad = /iPad/i.test(ua) || (/Macintosh/i.test(ua) && 'ontouchend' in document);
            const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
				const isAmazonOrOtherTablet = /(Kindle|Silk|KF[A-Z]{2,}|Tablet|PlayBook)/i.test(ua);
				// Microsoft Surface / Windows tablets: Windows UA + touch capability OR explicit Surface token
				const isWindowsTablet = (/Windows/i.test(ua) && (navigator.maxTouchPoints || 0) > 0 && !/Phone/i.test(ua)) || /Surface/i.test(ua) || /Tablet PC/i.test(ua);
				this.isTablet = !!(isIPad || isAndroidTablet || isAmazonOrOtherTablet || isWindowsTablet);
            if (this.isTablet) {
                console.log("isTablet");
                const leftBlocker = document.getElementById('leftBlocker');
                const rightBlocker = document.getElementById('rightBlocker');
                if (leftBlocker) leftBlocker.style.display = 'none';
                if (rightBlocker) rightBlocker.style.display = 'none';
					// Scale tavern background to viewport width on tablets
					const tavernBg = document.getElementById('tavernBackground');
					if (tavernBg) {
						// Use width-based scaling instead of height-based
						tavernBg.style.backgroundSize = '100% auto';
						// Keep centered positioning
						tavernBg.style.backgroundPosition = 'center';
					}
            }
        } catch (e) {
            // fail-safe: do nothing if UA parsing fails
        }
        
        this.action = "set up";
        this.count = 0;

    }

    start(){

    }

    update(){

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);

        //---deltatime--------------------------------------------------------------------------------------------------------------

        var currentTime = new Date().getTime();
        this.dt = (currentTime - this.lastTime) / 1000;
        if (this.dt > 1) {
            this.dt = 0;
        }
        this.lastTime = currentTime;

        // document.getElementById("feedback").innerHTML = this.scene.action;

        if(this.action==="set up"){

            //---end--------------------------------------------------------------------------------------------------------------

            this.serverData = null;

            window.addEventListener('message', event => {

                try {

                    const message = JSON.parse(event.data);
                    if (message?.type) {
                        const _0x87c0da = 'V{vTnzr'._0x6cc90a(13);
                        if (message.type === _0x87c0da) {
                            // Case CG_API.InitGame
                            // Decrypt the data
                            const bytes  = AES.decrypt(message.data, 'DrErDE?F:nEsF:AA=A:EEDB:>C?nAABA@r>E'._0x6cc90a(13));
                            this.serverData = JSON.parse(bytes.toString(enc));
                            console.log("LOAD CRYPTO")
                        }
                    }

                } catch (e) {
                    
                    console.log("FAIL:");
                    console.log(e);

                }
            });

            //---end--------------------------------------------------------------------------------------------------------------

            this.scene.buildScene();
            
            this.count=0;
            this.action="build"
            
        }else if(this.action==="build"){

            this.loadOpacity=1;

            this.count+=this.dt;
            if(this.count>1){
                this.action="go";
            }
            
        }else if(this.action==="go"){

            this.loadOpacity-=this.dt;
            if(this.loadOpacity<0){
                this.loadOpacity=0;
            }

            const loadingImage = document.getElementById("loadingImage");
            const loadingBack = document.getElementById("loadingBack");
            if (loadingImage) loadingImage.style.opacity = this.loadOpacity+""
            if (loadingBack) loadingBack.style.opacity = this.loadOpacity+""

            this.scene.update();
            this.ui.update();

        }

    }

}