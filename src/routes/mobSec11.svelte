<script>
  import { Splide, SplideSlide, SplideTrack } from "@splidejs/svelte-splide";
    import Fa from "svelte-fa";
    import {faStar,faPlayCircle} from "@fortawesome/free-solid-svg-icons";
    import {gsap} from "gsap";
    import {ScrollTrigger} from "gsap/ScrollTrigger"
    import {onMount} from "svelte"
    import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
    import {scale} from "svelte/transition"

        let innerWidth;
        let playing;
        let isPlaying=false;
        let ele;

        let arr=[
            {
            title:"Villa No.70",
            desc:"Cyprus Palms",
            dd:"See how the best-in-class automation solutions from Keus, elevated the living experience in this stunningly designed villa. Watch how the various smart controls like the Keus app, smart consoles and scene wizards come together to transform and provide true convenience to this gorgeous home.",
            stars:5,
            link:"https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Home+Videos/Compressed+Videos/Cyprus+Palms+Final+Comp.m4v"
        },
        {
            title:"Villa No. 39",
            desc:"Aditya Casagrande",
            dd:"Watch how the Keus smart home solution elevated and transformed the living experience of this beautifully designed super luxurious residence of over 15000sft.",
            stars:5,
            link:"https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Home+Videos/Compressed+Videos/Villa+No-39.m4v"
        },
        {
            title:"Villa No. 12",
            desc:"Aditya Casagrande",
            dd:"One of the best examples of how the living experience of a home comes alive and amplifies because of deep home automation.",
            stars:5,
            link:"https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Home+Videos/Compressed+Videos/Brijesh+House+Villa+No-13.m4v"
        }
            ]

    const triggerAllow=()=>{
        if(playing && !playing.paused){
            let y=ele.getBoundingClientRect();
            let vdo=playing;
            if(y.top>500){
                if(!vdo.paused) vdo.pause();
                isPlaying=false;
                // console.log("paused---------------")
            }
            if(y.top<-(y.height)){
                if(!vdo.paused) vdo.pause();
                isPlaying=false;
                // console.log("paused------------------")
            }
            if(y.top<200 && y.top>-(y.height)){
                // console.log("playing+++++++++++");
                vdo.play();
                isPlaying=true;
            }
        }
    } 

    onMount(()=>{
        gsap.registerPlugin(ScrollTrigger);

        var mtl11=gsap.timeline({
            scrollTrigger:{
                trigger:".mobContent11",
                // markers:true,
                scrub:1,
                start:"top 70%",
                end:"center 60%"
            }
        });

        let obj={
            y:30,
            opacity:0,
            duration:.8,
            ease:"slow.out",
        }
        mtl11.from(".mobHead11",obj)
            .from(".mobDesc11",{...obj,delay:2})
            .from(".mobTitle11",{...obj,delay:0})
            .from(".mobd11",{...obj,delay:6})
            .from(".mobdd11",{...obj,delay:0})
        let stars=gsap.utils.toArray(".mobStar");
        stars.forEach((x,i)=>mtl11.from(x,{x:-100,opacity:0,duration:.8,ease:"slow.out",delay:i==0? 10:0}));
        mtl11.from(".mobVdiv11,.playBtn",obj)
            
    })

</script>

<svelte:window bind:innerWidth on:scroll={triggerAllow} />

<div class="mobContent11" bind:this={ele}>
    <div class="mob11">
        <h1 class="mobHead11">Smart Home Tours</h1>
        <p class="mobDesc11">walkthroughs of our recent installations</p>
        <div class="mobSlideDiv11">
            <Splide options={
                {
                    type:"loop"
                }
            }
            hasTrack={false}
            on:move={
                ()=>{
                    if(playing && !playing.paused){
                        playing.load();
                        isPlaying=false;
                    }
                }
            }
                >
                <SplideTrack>
                    {#each arr as o,i}
                        <SplideSlide>
                            <h1 class="mobTitle11">{o.title}</h1>
                            <p class="mobd11">{o.desc}</p>
                            <p class="mobdd11 mobdd11-2">{o.dd}</p>
                            <div class="mobStars11 text-center">
                                <span class="mobStar"><Fa icon={faStar} 
                                    color="{o.stars>=1? "#BEBDBD":"#e5e5e5"}"
                                    /></span>
                                <span class="mobStar"><Fa icon={faStar} 
                                    color="{o.stars>=2? "#BEBDBD":"#e5e5e5"}"
                                    /></span>
                                <span class="mobStar"><Fa icon={faStar} 
                                    color="{o.stars>=3? "#BEBDBD":"#e5e5e5"}"
                                    /></span>
                                <span class="mobStar"><Fa icon={faStar} 
                                    color="{o.stars>=4? "#BEBDBD":"#e5e5e5"}"
                                    /></span>
                                <span class="mobStar"><Fa icon={faStar} 
                                    color="{o.stars>=5? "#BEBDBD":"#e5e5e5"}"
                                    /></span>
                            </div>
                            <div class="mobVdiv11">
                                {#if !isPlaying}
                                    <span class="playBtn">
                                        <Fa icon={faPlayCircle} size="{innerWidth*.006}x" color="#827f7e" />
                                    </span>
                                {/if}
                                <video src="{o?.link}"
                                preload="auto"
                                playsinline
                                on:click={
                                    e=>{
                                        if(e.target.paused){
                                            playing=e.target;
                                            isPlaying=true;
                                            e.target.play();
                                        }else{
                                            e.target.pause();
                                            isPlaying=false;
                                        }
                                    }
                                }
                                poster="videos/homes/{i+1}/poster.jpg"
                                class="mobV11"></video>
                            </div>
                        </SplideSlide>
                    {/each}
                </SplideTrack>
                <div class="splide__arrows" style="">
                    <button class="splide__arrow splide__arrow--prev p-mob11">
                        <span class="p11">
                            <Fa icon={faChevronRight} />
                        </span>
                    </button>
                    <button class="splide__arrow splide__arrow--next n-mob11">
                        <span class="n11">
                            <Fa icon={faChevronRight} />
                        </span>
                    </button>
                </div>
            </Splide>
        </div>
    </div>
</div>

<style>
    .n-mob11,.p-mob11{
        position:absolute;
        top:46%;
    }
    .playBtn{
        position: absolute;
        bottom:5vw;
        right:7vw;
    }
    .mobSlideDiv11{
        margin:15vw auto;
    }
    .mobContent11{
        padding:10vw 6vw;
    }
    .mobVdiv11{
        width:85vw;
        height:85vw;
        border-radius: 50px;
        position: relative;
        overflow: hidden;
        margin:10vw auto;
    }
    .mobV11{
        width: 100%;
        height: 85vw;
        object-fit: cover;
    }
    .mobHead11,.mobTitle11{
        font-family: 'Playfair Display', serif;
        text-align: center;
        font-size: 10vw;
    }
    .mobd11,.mobDesc11,.mobdd11{
        font-family: 'Raleway', sans-serif;
        text-align: center;
    }
    .mobdd11{
        min-height: 58vw;
        display:flex;
        align-items: center;
        padding:2.5vw;
    }
</style>