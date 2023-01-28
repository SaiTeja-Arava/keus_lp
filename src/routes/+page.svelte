<script>
    import {onMount,onDestroy} from 'svelte';
    import {gsap} from "gsap";
    import {ScrollTrigger} from "gsap/ScrollTrigger"
    import {Row,Col,Card,CardBody, Input,Modal,Icon, ModalBody, ModalHeader, Spinner} from "sveltestrap";
    import {formInview,booked} from "$lib/store/index"
    import Select from "svelte-select";
    import Tab3 from "./section3.svelte";
    import Tab4 from "./section4.svelte"
    import Win5 from "./WinSection5.svelte"
    import Win6 from "./WinSection6.svelte"
    import Win7 from "./WinSection7.svelte";
    import Win8 from "./WinSection8.svelte";
    import Win9 from "./WinSection9.svelte"
    import Win10 from "./WinSection10.svelte"
    import Win11 from "./WinSection11.svelte";
    import Win12 from './WinSection12.svelte';
    import Win13 from "./WinSection13.svelte";
    import Mob4 from "./mobSec4.svelte";
    import Mob5 from "./mobSec5.svelte"
    import Mob3 from "./mobSection3.svelte";
    import Mob6 from "./mobSec6.svelte";
    import Mob7 from "./mobSec7.svelte";
    import Mob8 from "./mobSec8.svelte";
    import Mob9 from "./mobSec9.svelte";
    import Mob10 from "./mobSec10.svelte";
    import Mob11 from "./mobSec11.svelte";
    import Mob12 from "./mobSec12.svelte";
    import Mob13 from "./mobSec13.svelte"
    import {formToggler} from "$lib/store/index";
    import {fly,fade} from "svelte/transition"
    import LeafLeft from "$lib/svgs/awardLeafLeft.svelte";
    import LeafRight from "$lib/svgs/awardLeafRight.svelte";
    import axios from "axios";
  import Fa from 'svelte-fa';
  import { faCheck } from '@fortawesome/free-solid-svg-icons';

    let innerWidth;
    let innerHeight;
    var tl;
    let ele;
    let mob=false;
    let FName;
    let Mobile;
    let Email;
    let ptype;
    let psize;
    let soc;
    let formproptyp=["Independent Home","Gated Villa","Apartment","Office","Architect/Interior Designer","Builder","PMC","Others"]
    let formpropsz=["1501-2000","2001-3000","3001-4000","4001-5000","5001-7000","7001-above"];
    let formstgcon=["Early Stage","Close To Handover","Electrical In Progress","Ready To Move"];
    let mfName;
    let mMobile;
    let mEmail;
    let mPtype;
    let mPsize;
    let mSoc;
    let f1Err=false;
    let f2Err=false;
    let mErr=false;
    let f1feed="";
    let f2feed="";
    let mfeed="";
    let lock1=false;
    let lock2=false;
    let lock3=false;

    $:{
        if(innerWidth<700) mob=true;
        else mob=false;
        console.log("innerWidth-",innerWidth)
    }

    const triggerAllow=()=>{
        let y;
        if(innerWidth>700){
            y=ele.getBoundingClientRect();
        }else{
            let fele=document.querySelector(".section2");
            y=fele?.getBoundingClientRect();
        }
        if(y.bottom>0){
            if(y.top<-(y.height)+200){
            formInview.set(true);
        }else if(y.top-y.height<0){
            formInview.set(false);
        }
        else{
            formInview.set(true);
        }
        }
        // console.log(y.bottom)
    }

    const checkNumber=(str,form)=>{
        let valid=true;
        if(form==1){
            if(str.length>10){
                f1feed="mobile number should be of 10 digits only";
                f1Err=true;
                return;
            }else f1Err=false;
            let err=/^\d+$/.test(str);
            f1Err=str==""? false:!err;
            f1feed="Characters are Not Allowed"
        }else if(form==2){
            if(str.length>10){
                f2feed="mobile number should be of 10 digits only";
                f2Err=true;
                return;
            }else f1Err=false;
            let err=/^\d+$/.test(str);
            f2Err=str==""? false:!err;
            f2feed="Characters are Not Allowed"
        }else{
            if(str.length>10){
                mfeed="mobile number should be of 10 digits only";
                mErr=true;
                return;
            }else f1Err=false;
            let err=/^\d+$/.test(str);
            mErr=str==""? false:!err;
            mfeed="Characters are Not Allowed"
        }
    }

    const formSubmit1=async ()=>{
        lock1=true;
        console.log("submitting");
        let data={
            name:FName,
            phone:Mobile,
            email:Email,
            ptype:ptype.value
        }
        if(psize) data.psize=psize.value;
        if(soc) data.soc=soc.value;
        if(!f1Err){
            let appointment=await axios.post("/api/bookAppointment",data).catch(err=>console.log("error",err));
            console.log(appointment);
            if(appointment?.data?.success){
                $booked=2;
                setTimeout(() => {
                    $booked=1;
                }, 400);
                FName=Mobile=Email=ptype=psize=soc=undefined;
            }
            lock1=false;
        }
    }

    const formSubmit2=async ()=>{
        let data={
            name:FName,
            phone:Mobile,
            email:Email,
            ptype:ptype.value
        }
        if(psize) data.psize=psize.value;
        if(soc) data.soc=soc.value;
        lock2=true;
        if(!f2Err){
            let appointment=await axios.post("/api/bookAppointment",data).catch(err=>console.log("error",err));
            console.log(appointment);
            if(appointment?.data?.success){
                $booked=2;
                setTimeout(() => {
                    $booked=1;
                }, 400);
                FName=Mobile=Email=ptype=psize=soc=undefined;
            }
            lock2=false;
        }
    }

    const formSubmit3=async ()=>{
        console.log("submitting3");
        let data={
            name:mfName,
            phone:mMobile,
            email:mEmail,
            ptype:mPtype
        }
        if(psize) data.psize=mPsize.value;
        if(soc) data.soc=mSoc.value;
        lock3=true;
        if(!mErr){
            let appointment=await axios.post("/api/bookAppointment",data).catch(err=>console.log("error",err));
            console.log(appointment);
            if(appointment?.data?.success){
                $booked=2;
                setTimeout(() => {
                    $booked=1;
                }, 400);
                mfName=mMobile=mEmail=mPtype=mPsize=mSoc=undefined;
            }
            lock3=false;
        }
    }

    onMount(async ()=>{

        
        let ele=document.querySelector(".section1");
        ele.style.color="#fff";
        let opt1={
            y:"2.5vw",
            opacity:0,
            duration:.8,
            ease:"slow.out"
        }
        gsap.from(".ani1",{...opt1,delay:.3})
        gsap.from(".ani2",{...opt1,delay:.45})
        gsap.from(".ani3",{...opt1,delay:.65})
        
    })

    onDestroy(()=>{
        
    })

</script>

<svelte:window bind:innerWidth bind:innerHeight on:scroll={triggerAllow} />
<!-- <p>{innerWidth}</p> -->
<div class="main" >
    <!-- <div class="scaleDiv"> -->
        <div class="section1 section"
        bind:this={ele}
        style="background-image: url(images/hall.jpg);">
            <div class="content">
                <div class="intro">
                    <h1 class="mainHeading ani1">Truly smart</h1>
                    <h1 class="mainHeading ani2">Truly wireless</h1><br/>
                    <p class="desc ani3">The Keus smart home automation is a wireless marvel that delivers deep automation experiences that are easy to install, easier to configure and easiest to use.</p>
                </div>
            </div>
        </div>

    {#if innerWidth<700}
    <div class="section2 section">
        <div class="form {innerWidth>1350? " float-end":"mx-auto"}">
            <Card class="text-center col-12" style="border:{innerWidth<800? "none":""}">
                <CardBody>
                    {#if $booked==0}
                    <form class="formContent" transition:fade on:submit|preventDefault={formSubmit1}>
                        <h3 class="cardHeading mb-3">Smart home demo</h3>
                        <p class="cardText mb-3"
                        >KEUS smart home automation helps unlock the potential of your spaces to create memorable and transformative experiences.</p>
                        <div class="inputs">
                            <div class="input">
                                <Input bind:value={FName} type="text" placeholder="*Full name" style="font-size:{innerWidth>800? "0.939vw":"18px"}" required />
                            </div>
                            <div class="input">
                                <Input type="tel" invalid={f1Err} feedback={f1feed}
                                on:change={e=>{
                                    if(e.target.value.length<10 && e.target.value.length>0){
                                        f2Err=true;
                                        f2feed="Mobile Number should be of 10 Digits";
                                    }
                                }}
                                bind:value={Mobile} on:input={(e)=>checkNumber(e.target.value,1)} placeholder="*Mobile" style="font-size:{innerWidth>800? "0.939vw":"18px"}" required />
                            </div>
                            <div class="input">
                                <Input type="email" placeholder="*Email" bind:value={Email} style="font-size:{innerWidth>800? "0.939vw":"18px"}" required />
                            </div>
                            <div class="input">
                                {#if innerWidth>700}
                                    <Select placeholder="*Property type" bind:value={ptype} required items={formproptyp} inputStyles="font-size:0.939vw" containerStyles="height:1.8vw" />
                                    {:else}
                                    <Select placeholder="*Property type" bind:value={ptype} required items={formproptyp} />
                                {/if}
                            </div>
                            <div class="input">
                                {#if innerWidth>700}
                                    <Select placeholder="Property size" bind:value={psize} items={formpropsz} inputStyles="font-size:0.939vw" containerStyles="height:1.8vw" />
                                    {:else}
                                    <Select placeholder="Property size" bind:value={psize} items={formpropsz} />
                                {/if}
                            </div>
                            <div class="input">
                                {#if innerWidth>700}
                                    <Select placeholder="State of construction" id="fsoc" bind:value={soc} items={formstgcon} inputStyles="font-size:0.939vw" containerStyles="height:1.8vw" />
                                    {:else}
                                    <Select placeholder="State of construction" id="fsoc" bind:value={soc} items={formstgcon} />
                                {/if}
                            </div>
                        </div>
                        {#if innerWidth>700}
                            <button class="submit" disabled={lock1} type="submit">{#if lock1}
                                <Spinner color="light" />
                            {:else}
                            Book your appointment
                            {/if}</button>
                            {:else}
                            <button class="submit" disabled={lock1} type="submit" style="font-size:20px;padding:15px;">
                                {#if lock1}
                                    <Spinner color="light" />
                                {:else}
                                Book your appointment
                                {/if}
                            </button>
                        {/if}
                    </form>
                    {:else if $booked==1}
                    <div class="thank-you" transition:fade>
                        <div class="thank-note">
                            <h1 class="thank-head">Thank you for registering your interest in KEUS.</h1>
                            <p class="thank-desc">Our home automation experts will get in touch with you.</p>
                        </div>
                        <div class="sucDone">
                            <Row>
                                <Col class="col-3 d-flex align-items-center justify-content-center">
                                    <span class="tick">
                                        <Fa icon={faCheck} size="{innerWidth>900? innerWidth*.001:innerWidth*.005}x" />
                                    </span>
                                </Col>
                                <Col class="">
                                    <h1 class="demo-done h-100 d-flex align-items-center">
                                        Demo Scheduled
                                    </h1>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    {/if}
                </CardBody>
            </Card>
        </div>
    </div>
    {/if}
    <!-- </div> -->
    {#if !$formInview && innerWidth>700}
    <div transition:fly={{y:-500,duration:1500}} class="section2 section">
        <div class="form {innerWidth>1350? " float-end":"mx-auto"}">
            <Card class="text-center col-12" style="border:{innerWidth<800? "none":""}">
                <CardBody>
                    {#if $booked==0}
                    <form class="formContent" transition:fade on:submit|preventDefault={formSubmit2}>
                        <h3 class="cardHeading mb-3">Smart home demo</h3>
                        <p class="cardText mb-3"
                        >KEUS smart home helps unlock the potential of your spaces to create memorable and transformative experiences.</p>
                        <div class="inputs">
                            <div class="input">
                                <Input type="text" bind:value={FName} placeholder="*Full name" style="font-size:{innerWidth>800? "0.939vw":"18px"}" required />
                            </div>
                            <div class="input">
                                <Input type="tel" invalid={f2Err} feedback={f2feed}
                                on:change={e=>{
                                    if(e.target.value.length<10 && e.target.value.length>0){
                                        f2Err=true;
                                        f2feed="Mobile Number should be of 10 Digits";
                                    }
                                }}
                                 bind:value={Mobile} on:input={(e)=>checkNumber(e.target.value,2)} placeholder="*Mobile" style="font-size:{innerWidth>800? "0.939vw":"18px"}" required />
                            </div>
                            <div class="input">
                                <Input type="email" bind:value={Email} placeholder="*Email" style="font-size:{innerWidth>800? "0.939vw":"18px"}" required />
                            </div>
                            <div class="input">
                                {#if innerWidth>700}
                                    <Select placeholder="*Property type" bind:value={ptype} required items={formproptyp} inputStyles="font-size:0.939vw" containerStyles="height:1.8vw" />
                                    {:else}
                                    <Select placeholder="*Property type" bind:value={ptype} required items={formproptyp} />
                                {/if}
                            </div>
                            <div class="input">
                                {#if innerWidth>700}
                                    <Select items={formpropsz} bind:value={psize} placeholder="Property size" inputStyles="font-size:0.939vw" containerStyles="height:1.8vw" />
                                    {:else}
                                    <Select placeholder="Property size" bind:value={psize} items={formpropsz}/>
                                {/if}
                            </div>
                            <div class="input">
                                {#if innerWidth>700}
                                    <Select placeholder="State of construction" id="fsoc" bind:value={soc} items={formstgcon} inputStyles="font-size:0.939vw" containerStyles="height:1.8vw" />
                                    {:else}
                                    <Select placeholder="State of construction" id="fsoc" bind:value={soc} items={formstgcon} />
                                {/if}
                            </div>
                        </div>
                        {#if innerWidth>700}
                            <button class="submit" disabled={lock2} type="submit">
                                {#if lock2}
                                <Spinner color="light" />
                            {:else}
                            Book your appointment
                            {/if}
                        </button>
                            {:else}
                            <button class="submit" disabled={lock2} type="submit" style="font-size:20px;padding:15px;">
                                {#if lock2}
                                    <Spinner color="light" />
                                {:else}
                                Book your appointment
                                {/if}
                            </button>
                        {/if}
                    </form>
                    {:else if $booked==1}
                        <div class="thank-you" transition:fade>
                            <div class="thank-note">
                                <h1 class="thank-head">Thank you for registering your interest in KEUS.</h1>
                                <p class="thank-desc">Our home automation experts will get in touch with you.</p>
                            </div>
                            <div class="sucDone">
                                <Row>
                                    <Col class="col-3 d-flex align-items-center justify-content-center">
                                        <span class="tick">
                                            <Fa icon={faCheck} size="{innerWidth>800? innerWidth*.001:innerWidth*.05}x" />
                                        </span>
                                    </Col>
                                    <Col class="">
                                        <h1 class="demo-done">
                                            Demo Scheduled
                                        </h1>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    {/if}
                </CardBody>
            </Card>
        </div>
    </div>
    {:else}
        <Modal body isOpen={$formToggler}
            toggle={()=>formToggler.set(!$formToggler)}>
            <ModalBody style="padding:0 0;z-index:0;display:flex">
                <div class="form mx-auto external">
                    <Card class="text-center col-12" style="border:none">
                        <CardBody style="padding:0">
                            {#if $booked==0}
                            <form class="formContent" transition:fade on:submit|preventDefault={formSubmit3}>
                                <h3 class="cardHeading mb-3">Smart home demo</h3>
                                <p class="cardText mb-3"
                                >KEUS smart home helps unlock the potential of your spaces to create memorable and transformative experiences.</p>
                                <div class="inputs">
                                    <div class="input">
                                        <Input type="text" bind:value={mfName} placeholder="*Full name" style="font-size:{innerWidth>800? "0.939vw":"18px"}"  required />
                                    </div>
                                    <div class="input">
                                        <Input type="tel" bind:value={mMobile} feedback={mfeed}
                                        on:change={e=>{
                                            if(e.target.value.length<10 && e.target.value.length>0){
                                                f2Err=true;
                                                f2feed="Mobile Number should be of 10 Digits";
                                            }
                                        }}
                                        invalid={mErr} on:input={(e)=>checkNumber(e.target.value,3)}
                                         placeholder="*Mobile" style="font-size:{innerWidth>800? "0.939vw":"18px"}" required />
                                    </div>
                                    <div class="input">
                                        <Input type="email" bind:value={mEmail} placeholder="*Email" style="font-size:{innerWidth>800? "0.939vw":"18px"}" required/>
                                        </div>
                                        <div class="input">
                                            {#if innerWidth>700}
                                            <Select placeholder="*Property type" required bind:value={mPtype} items={formproptyp} inputStyles="font-size:0.939vw" containerStyles="height:1.8vw" />
                                            {:else}
                                            <Select placeholder="*Property type" required bind:value={mPtype} items={formproptyp} />
                                            {/if}
                                        </div>
                                        <div class="input">
                                            {#if innerWidth>700}
                                            <Select placeholder="Property size" bind:value={mPsize} items={formpropsz} inputStyles="font-size:0.939vw" containerStyles="height:1.8vw" />
                                            {:else}
                                            <Select placeholder="Property size" bind:value={mPsize} items={formpropsz}/>
                                            {/if}
                                        </div>
                                        <div class="input">
                                            {#if innerWidth>700}
                                            <Select placeholder="State of construction" id="fsoc" bind:value={mSoc} items={formstgcon} inputStyles="font-size:0.939vw" containerStyles="height:1.8vw" />
                                            {:else}
                                            <Select placeholder="State of construction" id="fsoc" bind:value={mSoc} items={formstgcon} />
                                            {/if}
                                        </div>
                                    </div>
                                    {#if innerWidth>700}
                                    <button class="submit" disabled={lock3} type="submit">
                                        {#if lock3}
                                        <Spinner color="light" />
                                        {:else}
                                        Book your appointment
                                        {/if}
                                    </button>
                                    {:else}
                                    <button class="submit" type="submit" disabled={lock3} style="font-size:20px;padding:15px;">
                                        {#if lock3}
                                        <Spinner color="light" />
                                        {:else}
                                        Book your appointment
                                        {/if}
                                    </button>
                                    {/if}
                                </form>
                                {:else if $booked==1}
                                <div class="thank-you" transition:fade>
                                    <div class="thank-note">
                                        <h1 class="thank-head">Thank you for registering your interest in KEUS.</h1>
                                        <p class="thank-desc">Our home automation experts will get in touch with you.</p>
                                    </div>
                                    <div class="sucDone">
                                        <Row>
                                            <Col class="col-3 d-flex align-items-center justify-content-center">
                                                <span class="tick">
                                                    <Fa icon={faCheck} size="{innerWidth>800? innerWidth*.001:innerWidth*.005}x" />
                                                </span>
                                            </Col>
                                            <Col class="">
                                                <h1 class="demo-done h-100 d-flex align-items-center">
                                                    Demo Scheduled
                                                </h1>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            {/if}
                        </CardBody>
                    </Card>
                    </div>
                </ModalBody>
                <ModalHeader toggle={()=>formToggler.set(!$formToggler)}
                    style="position:absolute;top:0;right:0;border:none"
                    >
                </ModalHeader>
            </Modal>
        {/if}
    <div class="section3 section">
        {#if innerWidth>900 && !mob}
            <Tab3 />
            {:else}
            <Mob3 />
        {/if}
    </div>
    <div class="section4 section">
        {#if innerWidth>900 && !mob}
            <Tab4 />
            {:else}
            <Mob4 />
        {/if}
    </div>
    <div class="section section5">
        {#if innerWidth>900 && !mob}
            <Win5 />
            {:else}
            <Mob5 />
        {/if}
    </div>
    <div class="section section6">
        {#if innerWidth>900 && !mob}
            <Win6 />
            {:else}
            <Mob6 />
        {/if}
    </div>
    <div class="section section7">
        {#if innerWidth>900 && !mob}
            <Win7 />
            {:else}
            <Mob7 />
        {/if}
    </div>
    <div class="section section8">
        {#if innerWidth>900 && !mob}
            <Win8 />
            {:else}
            <Mob8 />
        {/if}
    </div>
    <div class="section9 section">
        {#if innerWidth>900 && !mob}
            <Win9 />
            {:else}
            <Mob9 />
        {/if}
    </div>
    <div class="section section10">
        {#if innerWidth>900 }
            <Win10 />
            {:else}
            <Mob10 />
        {/if}
    </div>
    <div class="section-imgs leafContainer">
        {#each ["Present in every luxury and premium project in Hyderabad",
        "200+ Architects & Interior Designers recommend Keus",
        "Preferred Automation Brand for all Luxury / Premium Villa & Apartment Projects"] as txt}
            <div class="col-lg-4 col-md-4 col-sm-12 d-inline-block">
                <div class="leaf-content">
                    <LeafLeft width={innerWidth>700? innerWidth*.03:innerWidth*.12} />
                    <p class="leaf-txt">{txt}</p>
                    <LeafRight width={innerWidth>700? innerWidth*.03:innerWidth*.12} />
                </div>
            </div>
        {/each}
    </div>
    <div class="section section11">
        {#if innerWidth>900}
        <Win11 />
        {:else}
        <Mob11 />
        {/if}
    </div>
    <div class="section12 section">
        {#if innerWidth>900 && !mob}
        <Win12 />
        {:else}
        <Mob12 />
        {/if}
    </div>
    <div class="section13 section">
        {#if innerWidth>900 && !mob}
        <Win13 />
        {:else}
        <Mob13 />
        {/if}
    </div>
</div>

<style>
    .demo-done{
        font-family: 'Raleway', sans-serif;
        font-size: 1.4vw;
        font-weight: 600;
        padding: .5vw 0;
        text-align: left;
        margin:0;
    }
    .thank-you{
        min-height: 35vw;
        padding:1vw;
    }
    .thank-note{
        padding:8vw 2vw 1vw;
    }
    .thank-head{
        font-family: 'Playfair Display', serif;
        font-size:2.3vw;
    }
    .thank-desc{
        font-family: 'Raleway', sans-serif;
        font-size: .8vw;
        width:65%;
        margin:2vw auto 5vw;
    }
    .sucDone{
        border:.1vw solid #000;
        margin:3.8vw auto 0;
        padding:.3vw 0;
    }
    .leaf-content{
        display: flex;
        align-items: center;
        justify-content: center;
        margin:5vw auto;
    }
    /* 0.05216666667 x px */
    .desc{
        width:24.51833vw;
        /* font-size: 25px; */
        font-size: 1.30vw;
    }
    .section{
        /* height:1000px; */
        min-height: 60vw; 
        min-width:100%;
        position: relative;
        overflow: hidden;
    }
    .section1{
        /* background-color: transparent; */
        background-size:100% 100%;
        color:transparent;
        background-repeat: no-repeat;
        overflow: hidden;
        min-height:60vw;
    }
    .leaf-txt{
        width:50%;
        font-family: 'Playfair Display', serif;
        color:#000;
        font-size: 1.1vw;
        font-weight: 500;
    }
    .mainHeading{
        font-family: 'Playfair Display', serif;
        font-weight: 700;
        /* font-size:60px; */
        font-size:3.13vw;
    }
    .cardText,.cardHeading{
        color:#282828;
        margin:auto;
    }
    .cardHeading{
        font-family: 'Playfair Display', serif;
        font-weight: 400;
        /* font-size:40px; */
        font-size:2.09vw;
    }
    .cardText{
        font-family: 'Raleway', sans-serif;
        /* font-size: 14px; */
        font-size: 0.73vw;
        /* line-height: 20px; */
        line-height: 1.044vw;
    }
    .content{
        margin:20vw 0 0;
        width:85%;
    }
    .intro{
        margin:22vw 15vw 0;
    }
    .section2{
        position: absolute;
        /* padding:40px 0 0; */
        min-height: 60vw;
        padding:2.0866vw 0 0;
        top:10vh;
        left:58%;
        min-width: 27vw;
    }
    .input{
        /* width:400px; */
        width:20.86vw;
        /* margin:20px auto; */
        margin:1.044vw auto;
    }
    .form{
        /* width:500px; */
        width:26.0834vw;
        position: inherit;
    }
    .formContent{
        /* padding:35px; */
        padding:1.82583vw;
    }
    .submit{
        width:20.86vw;
        /* height:55px; */
        height:2.869vw;
        color:#fff;
        background-color:#835031;
        margin:1vw 0 0;
        /* font-size: 20px; */
        font-size: 1.044vw;
        border: none;
    }
    .section3,.section4{
        background-color: #E3DDD9;
        min-height: 50vw;
    }
    .section5{
        background-color: #C8B8AD;
        overflow: hidden;
    }
    .section-imgs{
        background-color: #E3DDD9;
        text-align: center;
        min-height:5vw;
        position:relative;
    }
    .section7{
        background-color: #E3DDD9;
        overflow: hidden;
        position:relative;
        min-height: 0;
    }
    .section8{
        min-height:50vw;
    }
    .section9{
        background-color: #E3DDD9;
        min-height:0;
    }
    .section10{
        min-height: 50vw;
        padding:0 0 3vw;
    }
    .section11{
        overflow: hidden;
    }
    .section12{
        min-height: 30vw;
        background-color: #E3DDD9;
    }
    .section13{
        background-color: #202020;
        min-height: 50vw;
    }
    @media screen and (max-width:900px){
        ::-webkit-scrollbar{
            display: none;
        }
        .thank-you{
            padding:18vw 3vw 2vw;
        }
        .thank-note{
            padding:10vw 6vw 2vw;
        }
        .thank-desc{
            font-size: 3.2vw;
            margin:10vw auto 20vw;
        }
        .sucDone{
            border:.01vw solid #000;
            margin:15vw auto 3vw;
            padding:3vw 0;
        }
        .demo-done{
            font-size: 5vw;
        }
        .thank-head{
            font-size: 8vw;
        }
        .leaf-txt{
            font-size: 4.5vw;
        }
        .leaf-content{
            margin:10vw auto 5vw;
        }
        *{
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        .mainHeading{
            font-size:12.5vw;
            font-weight: 400;
            /* font-size:2.504vw; */
        }
        .content{
            margin:60vw auto;
            position:relative;
            top:10vw;
            width:100%;
        }
        .intro{
            width:80%;
            margin:auto;
            text-align: left;
        }
        .section1{
            min-height:52vw;
            background-size:cover;
        }
        .desc{
            width:320px;
            font-size: 4.5vw;
            width:90%;
            font-weight: 300;
        }
        .cardHeading{
            font-size: 45px;
            line-height: 50px;
        }
        .cardText{
            font-size: 18px;
            line-height: 25px;
            width:288px;
        }
        .section2{
            position: relative;
            padding:0;
            min-height:10vh;
            min-width:100%;
            background: #fff;
            left:0;
            top:0;
        }
        .form{
            width:370px;
            position: inherit;
            margin:50px auto;
        }
        .input,.submit{
            width:288px;
        }
        .submit{
            margin:20px auto;
            height:auto;
        }
    }
</style>