<script>
    import {Row,Col,Input, Spinner} from "sveltestrap";
    import Fa from "svelte-fa";
    import Select from "svelte-select";
    import {faFacebook, faInstagram, faLinkedin,} from "@fortawesome/free-brands-svg-icons"
    import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
    import {formInview,booked} from "$lib/store/index"
    import axios from "axios";
    let ele;
    let FName;
    let Mobile;
    let Email;
    let ptype;
    let psize;
    let soc;
    let lock=false;
    let formproptyp=["Independent Home","Gated Villa","Apartment","Office","Architect/Interior Designer","Builder","PMC","Others"]
    let formpropsz=["1501-2000","2001-3000","3001-4000","4001-5000","5001-7000","7001-above"];
    let formstgcon=["Early Stage","Close To Handover","Electrical In Progress","Ready To Move"];

  const triggerAllow=()=>{
        let y;
        if(innerWidth>700){
            y=ele.getBoundingClientRect();
        }else{
            let fele=document.querySelector(".mobContent13");
            y=fele?.getBoundingClientRect();
        }
        if(y.top<y.height+550){
            if(y.top+500>=y.height){
                formInview.set(true);
                // console.log("executed lk")
            } 
            if(y.top-y.height<0){
                formInview.set(false);
            }
        }
        // console.log(y.top+200,y.height)
    }

    const submitForm=async ()=>{
        lock=true;
        let data={
            name:FName,
            phone:Mobile,
            email:Email,
            ptype:ptype.value
        }
        if(psize) data.psize=psize.value;
        if(soc) data.soc=soc.value;
        let appointment=await axios.post("/api/bookAppointment",data).catch(err=>console.log("error",err));
        console.log(appointment);
        if(appointment?.data?.success){
            $booked=2;
            setTimeout(() => {
                $booked=1;
            }, 400);
            FName=Mobile=Email=ptype=psize=soc=undefined;
        }
        lock=false;
    }
</script>

<svelte:window on:scroll={triggerAllow} />

<div class="mobContent13" bind:this={ele}>
    <div class="mob13">
        <div class="left13 float-end">
            <h1 class="mobHead13">Elevate your living experience</h1>
            <p class="mobDesc13">Register for a exclusive smart home demo at our custom <br/>
                built studio apartment.
            </p>
        </div>
        <div class="form13">
            <form class="formContent13" on:submit|preventDefault={submitForm}>
                <input class="inp" bind:value={FName} type="text" placeholder="&ensp;&ensp;Full name" required>
                <input class="inp" bind:value={Mobile} type="tel" placeholder="&ensp;&ensp;Mobile" required>
                <input class="inp" bind:value={Email} type="email" placeholder="&ensp;&ensp;Email" required>
                <div class="input">
                    <Select bind:value={ptype} required items={formproptyp} containerStyles="background-color:#373737;border:none;height:2.5vw" inputStyles="height:100%;font-size:3.1vw;" placeholder="&ensp;&ensp;Property type" />
                </div>
                <div class="input">
                    <Select bind:value={psize} items={formpropsz} containerStyles="background-color:#373737;border:none;height:2.5vw" inputStyles="height:100%;font-size:3.1vw;" placeholder="&ensp;&ensp;Property size" />
                </div>
                <div class="input">
                    <Select bind:value={soc} items={formstgcon} containerStyles="background-color:#373737;border:none;height:2.5vw" inputStyles="height:100%;font-size:3.1vw;" placeholder="&ensp;&ensp;Stage of construction" />
                </div>
                <button type="submit" class="submit">
                    {#if lock}
                            <Spinner color="light" />
                        {:else}
                        Book your appointment
                        {/if}
                </button>
            </form>
        </div>
        <!-- <div class="mobFooter13">
            <div class="d-block">
                <a href="" class="footerLink13">About Us</a>
                <a href="" class="footerLink13">Contact</a>
                <a href="" class="footerLink13">Career</a>
            <br/>
                <a href="" class="footerLink13">Press Room</a>
                <a href="" class="footerLink13">Gallery</a>
                <a href="" class="footerLink13">Awards</a>
            <br/>
                <a href="" class="footerLink13">Cookie Polices</a>
                <a href="" class="footerLink13">Terms & Conditions</a>
                <a href="" class="footerLink13">Service & Support</a>
                   
            </div>
        </div> -->
    </div>
    <div class="mobFoot13">
        <p class="mobFootDesc13">Copyright &copy 2020 KEUS All rights reserved &emsp;
        </p>
        <p class="iconP text-center">
            <span class="icons13">
                <a href="" class="icon13"><Fa icon={faInstagram} size="2x"  /></a>
                <a href="" class="icon13"><Fa icon={faFacebook} size="2x" /></a>
                <a href="" class="icon13"><Fa icon={faLinkedin} size="2x" /></a>
                <a href="" class="icon13"><Fa icon={faEnvelope} size="2x" /></a>
            </span>
        </p>
    </div>
</div>

<style>
    .icon13{
        margin-left: 8px;
    }
    .footerLink13,.icon13{
        color:#fff;
        text-decoration: none;
    }
    .footerLink13{
        display: block;
        text-align: center;
        margin:2vw;
    }
    .submit{
        color:#fff;
        border:none;
        background-color: #8fbec4;
        font-size: 5vw;
        width:100%;
        margin:3vw auto 10vw;
        padding:1vw;
    }
    .inp{
        background-color: #373737;
        color: #78848f;
        border:none;
        display: block;
        width:100%;
        margin:2vw auto;
        height: 10vw;
        font-size: 4vw;
    }
    .inp:focus{
        outline: none;
    }
    .input{
        width:100%;
        color: #78848f;
        margin:2vw auto;
    }
    .mobContent13{
        background-color: #202020;
        color:#fff;
        margin:25vw auto 0;
    }
    .mob13{
        /* margin:10vw auto; */
        padding:0 15vw;
    }
    .iconP{
        margin:0;
    }
    .mobHead13{
        font-family: 'Playfair Display', serif;
        text-align: center;
        font-size: 9vw;
    }
    .mobFoot13{
        background-color: #000;
        padding:2vw;
        min-height: 10vw;
    }
    .mobDesc13,.mobFootDesc13{
        font-family: 'Raleway', sans-serif;
        text-align: center;
        font-size: 2.6vw;
        margin:50vw auto 0;
    }
    .mobDesc13{
        margin:3vw auto 8vw;
    }
    .mobFootDesc13{
        display: flex;
        align-items: center;
        justify-content: center;
        margin:3vw auto 3vw;
    }
</style>