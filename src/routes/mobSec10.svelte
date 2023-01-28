<script>
  import { Splide, SplideSlide, SplideTrack } from "@splidejs/svelte-splide";
  import Fa from "svelte-fa";
  import {faPlayCircle,faChevronRight} from "@fortawesome/free-solid-svg-icons";
  import {onMount} from "svelte";
  import {gsap} from "gsap";
  import {ScrollTrigger} from "gsap/ScrollTrigger";
  import {scale} from "svelte/transition"

    let lastPlaying;
    let playing;
    let isPlaying;
    let innerWidth;
    let ele;
    let tabs=["baba","neelesh","priyanka","sravanthiKollur","suprajaRao","vaishnaviLinga","naveenPanuganti"]
    let arr=[
        {
            title:"Baba Shashank",
            desc:"Space Fiction Studio",
            link:"https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Baba+Shashank+Final.m4v"
        },
        {
            title:"S Neelesh Kumar",
            desc:"23 deg Design Shift",
            link:"https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/S+Neelesh+Kumar+3.m4v"
        },
        {
            title:"Priyanka Ghattamaneni",
            desc:"Studio Emerald",
            link:"https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Priyanka+Ghattamaneni+F.m4v"
        },
        {
            title:"Sravanthi Kolluri",
            desc:"Principal Architect EssEnn Architects",
            link:"https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Sravanthi+1080+1.m4v"
        },
        {
            title:"Supraja Rao",
            desc:"Design House",
            link:"https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Supraja+Rao+Hd+1080.m4v"
        },
        {
            title:"Vishnavi Linga",
            desc:"VAL Atelier",
            link:"https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Vaishnavi+Linga.m4v"
        },
        {
            title:"Naveen Panuganti",
            desc:'Principal Architect Naveen Associates',
            link:"https://keus-resources.s3.ap-south-1.amazonaws.com/landing_page_files/drive-download-20230116T073317Z-001/Architect+videos/Naveen+Panuganti+1080+1.m4v"
        }
    ];
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
            }
        }
    }

    onMount(()=>{
        gsap.registerPlugin(ScrollTrigger);

        var mtl10=gsap.timeline({
            scrollTrigger:{
                trigger:".mobContent10",
                // markers:true,
                scrub:1,
                start:"top 70%",
                end:"center 70%"
            }
        });

        let obj={
            y:50,
            opacity:0,
            ease:"slow.out"
        }

        mtl10.from(".mobHead10",obj)
            .from(".mobDesc10",obj)
            .from(".mobV10,.playBtn10",obj)
            .from(".mobTitle10",obj)
            .from(".mobd10",obj)
    })
</script>

<svelte:window bind:innerWidth on:scroll={triggerAllow} />

<div class="mobContent10" bind:this={ele}>
    <div class="mob10">
        <h1 class="mobHead10">Architect Speak</h1>
        <p class="mobDesc10">Love from the industry</p>
        <div class="mobSlider10">
            <Splide options={
                {
                    type:"loop",
                }
            }
            hasTrack={false}
            on:move={
                ()=>{
                    if(playing && !playing.paused) {
                        playing.load();
                        isPlaying=false;
                    }
                }
            }
            >
                <SplideTrack>
                    {#each arr as o,i}
                        <SplideSlide>
                            <div class="mobSlide10">
                                <div class="mobVdiv10">
                                    {#if !isPlaying}
                                        <span class="playBtn10">
                                            <Fa icon={faPlayCircle} size="{innerWidth*.006}x" color="#827f7e" />
                                        </span>
                                    {/if}
                                    <video src="{o?.link}"
                                    preload="auto"
                                    on:click={
                                        (e)=>{
                                            if(e.target.paused){
                                                if(playing) lastPlaying=playing;
                                                playing=e.target;
                                                e.target.play();
                                                isPlaying=true;
                                            }else{
                                                e.target.pause();
                                                isPlaying=false;
                                            }
                                        }
                                    }
                                    loop
                                    playsinline
                                    poster="videos/{tabs[i]}/poster.jpg"
                                    class="mobV10"></video>
                                </div>
                                <h1 class="mobTitle10">{o.title}</h1>
                                <p class="mobd10">{o.desc}</p>
                            </div>
                        </SplideSlide>
                    {/each}
                </SplideTrack>
                <div class="splide__arrows" style="position:relative;bottom:40px;">
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
    .playBtn10{
        position: absolute;
        bottom:48vw;
        right:15vw;
        z-index: 999;
    }
    .mobContent10{
        padding:20vw 0;
    }
    .mobVdiv10{
        width:85vw;
        height:85vw;
        margin:5vw auto;
        overflow: hidden;
        border-radius: 60px;
    }
    .mobV10{
        width:100%;
        object-fit: cover;
    }
    .mobHead10,.mobTitle10{
        font-family: 'Playfair Display', serif;
        text-align: center;
        font-size: 10vw;
    }
    .mobd10,.mobDesc10{
        font-family: 'Raleway', sans-serif;
        text-align: center;
    }
    .mobDesc10{
        margin:3vw auto 5vw;
    }
</style>