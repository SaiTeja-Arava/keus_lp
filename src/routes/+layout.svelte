<script>
    import { faArrowUpLong, faMobile, faPhone } from "@fortawesome/free-solid-svg-icons";
    import {onMount} from "svelte";
    import Fa from "svelte-fa";
  import { Button } from "sveltestrap";
  import {formInview, formToggler,booked} from "$lib/store/index"
  import {fly,scale,fade} from "svelte/transition"
  import { goto } from "$app/navigation";
  import { sineOut } from "svelte/easing";
    
    let lscroll;
    let innerWidth;

    const toggle=()=>{
        let ele=document.querySelector(".main");
        let dim=ele?.getBoundingClientRect();
        let nav=document.querySelector(".navbar");
        let gtdiv=document.querySelector(".goToTop");
        if(dim.y>-500 && gtdiv) gtdiv.style.right="-7vw";
        else if(gtdiv) gtdiv.style.right="4vw"

        if(lscroll){
            if(lscroll>dim.y){
                // console.log("closed")
                nav.style.top="-20vw";
                lscroll=dim.y;
            }
            else{
                // console.log("opened")
                 nav.style.top="0";
                 lscroll=dim?.y;
                }
        }
        else lscroll=dim.y
    }

    onMount(()=>{
      if(innerWidth<800) formInview.set(true);
    })
</script>

<svelte:window on:scroll={toggle} bind:innerWidth />

<nav class="navbar fixed-top pt-0 pb-0 navbar-expand-md"

>
    <div class="container-fluid">
      <a class="navbar-brand">
        <img src="images/logo.png" alt="logo" class="mainLogo">
      </a>
      
      <div >
        <ul class="navbar-nav mb-2 mb-lg-0 ms-auto">
          <li class="nav-item"
          style="margin:0;transition:1s"
          >
            <a class="nav-link mobNum" aria-current="page" href="tel:9392905179">
              <span class="icon">
                <Fa icon={faPhone} color="#835031" />
              </span>
              9392905179
            </a>
          </li>
          {#if $formInview && innerWidth>700 && $booked==0}
            <li class="nav-item" transition:scale>
              <span class="nav-link">
                  <Button
                  style="background-color:#835031;font-size:1vw;box-shadow:.1vw .1vw .4vw #835031;border:none;opacity:1"
                  on:click={()=>formToggler.set(!$formToggler)}
                  >
                  Book your Appointment
                </Button>
              </span>
            </li>
            
          {/if}
        </ul>
      </div>
    </div>
  </nav>
  {#if $formInview && innerWidth<700 && !$formToggler && $booked==0}
  <div class="btn-holder" transition:fly={{y:50,opacity:0,easing:sineOut,duration:500}}>
        <button
          on:click={
            ()=>{
              formToggler.set(!$formToggler);
            }
          }
        class="submit">Book your Appointment</button>
      </div>
    {/if}
  <div id="top"></div>
 {#if innerWidth>800}
    <div class="goToTop">
      <a class="goBtn" on:click={()=>goto("#top")}><span class="goIcon">
        <Fa icon={faArrowUpLong} size="{innerWidth*.0008}x" color="#fff" />
      </span>
        <p class="desc">TOP</p>
    </a>
  </div>
 {/if}
 
<slot />

<style>
  .btn-holder{
      position: fixed;
      z-index:999999999;
      background-color:rgba(255,255,255,.8);
      font-size: 5vw;
      bottom:0;
      min-height:8vh;
      min-width:100vw;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .desc{
    color:#fff;
    margin:.3vw auto;
    font-size: 1vw;
  }
  .goIcon{
    margin:auto;
  }
  .icon{
    margin:.5vw;
  }
  .nav-link{
    font-size: 1vw;
    display: flex;
    align-items: center;
    padding:1vw;
    transition:100ms ;
    color:#835031;
  }
  .mobNum{
    font-weight: 700;
    font-size:1vw;
  }
    .nav-item{
        margin:0 1.5vw;
        display: flex;
        align-items: center;
        transition:200ms;
    }

    .nav-link:hover{
      scale:1.08;
    }
    .navbar{
        padding-left:3vw;
        transition: 500ms;
        background-color: rgba(255,255,255,.9);
        /* opacity:.8; */
    }
    .mainLogo{
        width:4.5vw;
        opacity:1;
    }
    .goToTop{
      color:#56483D;
      position: fixed;
      z-index: 99;
      bottom:2.5vw;
      right:-7vw;
      transition:300ms;
    }
    .goBtn{
      background-color: #56483D;
      display:block;
      position:absolute;
      right: 0;
      bottom:0;
      text-align: center;
      padding:1vw 2vw 1vw;
      font-weight: 600;
      text-decoration: none;
      border-radius: 50%;
      transition:all 500ms;
    }
    .goToTop:hover .goBtn{
      cursor: pointer;
      bottom:1vw;
      background-color: #5d3923;
      box-shadow: 0 .2vw .4vw #000;
    }
    .submit{
        /* position: fixed; */
        /* z-index:999999999; */
        margin:auto;
        width:70vw;
        /* left:15vw; */
        opacity: 1;
        /* height:55px; */
        color:#fff;
        background-color:#835031;
        /* font-size: 20px; */
        font-size: 5vw;
        padding:2vw 5vw;
        /* bottom:2vh; */
        box-shadow:1vw 1vw 4vw #835031 ;
        border-radius: 2vw;
        border:none;
    }
    @media screen and (max-width:800px){
      .mainLogo{
        width:70%;
      }
      .icon{
        margin:2vw;
      }
      .nav-link{
        font-size: 20px;
      }
    }
</style>