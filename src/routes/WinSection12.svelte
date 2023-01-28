<script>
    import {onMount} from "svelte";
    import {gsap} from "gsap";
    import {ScrollTrigger} from "gsap/ScrollTrigger";
  import { random } from "gsap/gsap-core";

    let arr=[1,2,3,4,5,6,7,8,9,10,11,12];

    onMount(()=>{
        gsap.registerPlugin(ScrollTrigger);
        
        var tl12=gsap.timeline({
            scrollTrigger:{
                trigger:".container12",
                start:"top 65%",
                end:"15% 65%",
                scrub:1,
                // markers:true
            }
        });
        let tlop={
            y:"2.5vw",
            opacity:0,
            duration:.8
        }
        tl12.from(".mainHead12",tlop)

        let imgs=gsap.utils.toArray(".img12")

        imgs.forEach((img,i)=>{
            gsap.from(img,{
            scrollTrigger:{
                trigger:".container12",
                start:"15% center",
                end:"100% center",
                // markers:true,
                toggleActions:"restart none none reverse"
            },
            y:"40vw",
            delay:i/15,
            duration:.8,
            opacity:0,
            ease:"cric.out",
        })
        })
    })
    
</script>

<div class="container12 pt-5">
    <div class="content12 mt-5">
        <h1 class="mainHead12 mt-5">Smart Home Projects</h1>
        <!-- <p class="desc12">Choose your controls. </p> -->
        {#each arr as img}
            <img src="images/img{img}.png" alt="img{img}" class="col-md-2 col-sm-6 img12">
        {/each}
    </div>
</div>

<style>
    .container12{
        overflow: hidden;
        padding-bottom: 3.5vw;
    }
    .mainHead12,.title12{
        font-family: 'Playfair Display', serif;
    }
    .mainHead12{
        font-weight: 400;
        /* font-size: 50px; */
        font-size: 2.6083vw;
        text-align: center;
    }
</style>