"use client"; 
import { useState } from "react";
import OverlayScrollbarsInit from "@/app/components/customscrollbar";
import { 
  BootstrapBundle, 
  CustomMin, 
  JqueryMin, 
  MomentMin, 
} from "@/app/components/JsClients"; 
import ContentEditModal from "@/app/dashboard/dashboardmodals/edit.content.modal";
import useSWR from "swr";
import Loading from "@/app/components/Loading";
import ImageEditModal from "../../dashboardmodals/edit.image.modal";
import ContentEditYTSModal from "../../dashboardmodals/edit.yt.testimonials.modal";
import { Achievements, YoutubeWrapper, YoutubeWrapperLinks } from "@/app/components/YoutubeWrapper"; 
import ContentEditAchievementsModal from "../../dashboardmodals/edit.content.achievements.modal";

  

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function EditMainPage() {
    const [modal, setModal] = useState<editType | null>(null);
    const [imgModal, setImgModal ] = useState<editType | null>(null);
    const [yts, setYTS] = useState<editType | null>(null);
    const [contentWithTitle, setcontentWithTitle] = useState<editType | null>(null);

    const currentYear = new Date().getFullYear();

    async function EditorContent(contentId:string) {
        setModal({ cont_id: contentId   });
    }
    async function EditorContentYTS(contentId:string) {
        setYTS({ cont_id: contentId  });
    }
    async function EditorImage(contentId:string) {
        setImgModal({  cont_id: contentId  });
    }
    async function EditorContentWithTitle(contentId:string) {
        setcontentWithTitle({  cont_id: contentId  });
    }

    
  const { data, mutate, isLoading } = useSWR(`/api/content/fetch`,  fetcher );

    async function handleModalSave() {

    }

    if (isLoading) return <Loading />
    const content = data.data;

    return (
        <>

        <section className="mainbody">
 
    {/* <!-- Top Announcement Bar --> */}
    <div className="announcement-bar text-center">
        <div className="container">
            <span className="accent-text">Now open:</span> {content.top_section_home.section_text}
        <button 
        onClick={()=>EditorContent("top_section_home") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>

        </div>
    </div>

    {/* <!-- Hero Content Section --> */}
    <section className="hero-section text-center">
        <div className="container">
            
            {/* <!-- Target Audience Pill --> */}
            <div className="mb-4">
                <div className="audience-pill">
                    {content?.for_professionals?.section_text ?? ""}
                       <button 
        onClick={()=>EditorContent("for_professionals") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
                </div>
            </div>

            {/* <!-- Main Headline --> */}
            <h1 className="headline-text fw-normal mb-4"> 
                    {content?.skip_years?.section_text ?? ""}
                       <button 
        onClick={()=>EditorContent("skip_years") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </h1>

            {/* <!-- Coach Sub-heading --> */}
            <p className="coach-attribution mb-0"> 
             {content?.public_speaking_coach?.section_text ?? ""}
                       <button 
        onClick={()=>EditorContent("public_speaking_coach") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </p>

        </div>
    </section>

     <section className="video-section text-center">
        <div className="container">
            
            {/* <!-- Section Title --> */}
            <h2 className="video-title"> 
                
             {content?.speak_with_confidence?.section_text ?? ""}
                       <button 
        onClick={()=>EditorContent("speak_with_confidence") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
                </h2>

            {/* <!-- Video Player Embed Container --> */}
            <div className="video-wrapper mb-4">
                { content?.first_yt_link?.section_text && (
                    <YoutubeWrapper link={ content?.first_yt_link?.section_text??'' } />
                
                )}
                 
        <button style={{position:"absolute"}}
        onClick={()=>EditorContent("first_yt_link") }
        className="btn btn-sm btn-secondary "
        ><i className="bi bi-pencil-fill"></i> Edit Youtube Link</button><br/>
            </div>

            {/* <!-- Main CTA Button --> */}
            <div className="mb-2">
                <a href="#" className="btn-cta-yellow"> 
                      {content?.getInstantAccess?.section_text ?? ""}
                </a>
           
                       <button 
        onClick={()=>EditorContent("getInstantAccess") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </div>

            {/* <!-- Sub-text note --> */}
            <p className="small text-light mb-2 fw-semibold opacity-90">
                
                  {content?.plus_acces_to_livecoaching?.section_text ?? ""}
                       <button 
        onClick={()=>EditorContent("plus_acces_to_livecoaching") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </p>

            {/* <!-- Next Q&A Pill --> */}
            <div className="mb-3">
                <span className="info-pill">
                
                  {content?.next_qna?.section_text ?? ""}
                  </span>
                       <button 
        onClick={()=>EditorContent("next_qna") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </div>

            {/* <!-- Bottom Description --> */}
            <p className="sub-description"> 
                  {content?.simple_self_paced_system?.section_text ?? ""}
                       <button 
        onClick={()=>EditorContent("simple_self_paced_system") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </p>

        </div>
    </section>

     {/* <!-- Testimonials Section --> */}
    <section className="testimonials-section text-center">
        <div className="container" style={{maxWidth: "1140px"}}>
            
            {/* <!-- Heading --> */}
            <h2 className="section-heading mb-5">TESTIMONIAL'S
                
                       <button 
        onClick={()=>EditorContentYTS("testimonials_yt_link") }
        className="btn btn-sm btn-secondary "
        ><i className="bi bi-pencil-fill"></i> Edit Youtube Links</button> 
            </h2>

            {/* <!-- Video Grid --> */}
            { content?.testimonials_yt_link?.section_text && (
            <div className="row g-4 justify-content-center">
                {
                    <YoutubeWrapperLinks link={content?.testimonials_yt_link?.section_text} />
                } 
            </div>
            )}

        </div>
    </section>


     {/* <!-- Pricing Offer Banner --> */}
    <section className="pricing-banner text-center">
        <div className="container">
            <p className="banner-subtext mb-2"
                >
                
                {content?.limited_time_offer?.section_text ?? ""}
        <button 
        onClick={()=>EditorContent("limited_time_offer") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>

            </p>
            <h2 className="price-text mb-3"> 
                {content?.def_amount?.section_text ?? ""}
        <button 
        onClick={()=>EditorContent("def_amount") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </h2>
            <div>
                <a href="#" className="btn-cta-yellow">
                    
                {content?.get_instant_accessx?.section_text ?? ""}
        <button 
        onClick={()=>EditorContent("get_instant_accessx") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
                </a>
            </div>

            
        

        </div>
    </section>

    {/* <!-- What You'll Achieve Section --> */}
    <section className="achieve-section text-center ">
        <div className="container" style={{maxWidth: "960px;"}}>
            
            <h2 className="section-title fw-bold mb-5">
                What You'll <em>Achieve</em>
                
        <button 
        onClick={()=>EditorContentWithTitle("what_youll_achieve_xs") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </h2>

            {/* <!-- 2-Column Grid --> */}
            <div className="row g-4 text-start">
                
                  { content?.what_youll_achieve_xs?.section_text && (
                    <Achievements titles={content?.what_youll_achieve_xs?.section_title??''}
                    texts={content?.what_youll_achieve_xs?.section_text??''}
                     />
                  )
                }

            </div>

            <div className="mt-4">
                <p> 
                {content?.students_who_enroll?.section_text ?? ""}
        <button 
        onClick={()=>EditorContent("students_who_enroll") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
                </p>

                <div>
                <a href="#" className="btn-cta-yellow">
                    {content?.next_qna?.section_text ?? ""}
                    </a> 
        <button 
        onClick={()=>EditorContent("next_qna") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </div>

            </div>

        </div>
    </section>

    
     <section className="video2-section text-center">
        <div className="container">
            <div className="bg-grey">
            
            {/* <!-- Section Title --> */}
            <h2 className="section-title fw-bold "><em>Proof</em> That This Works</h2>
            <p> 
                
                {content?.i_have_coached?.section_text ?? ""}
        <button 
        onClick={()=>EditorContent("i_have_coached") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </p>

        { content?.second_yt_link?.section_text && (
                <YoutubeWrapper link={ content?.second_yt_link?.section_text??'' } />
            
            )}
                
        <button style={{position:"absolute"}}
        onClick={()=>EditorContent("second_yt_link") }
        className="btn btn-sm btn-secondary "
        ><i className="bi bi-pencil-fill"></i> Edit Youtube Link</button><br/><br></br>
           

            {/* <!-- Main CTA Button --> */}
            <div className="mb-2">
                <a href="/page/contact" className="btn-cta-yellow">
                    {content?.getInstantAccess?.section_text ?? ""}
                </a>
                          <button 
        onClick={()=>EditorContent("getInstantAccess") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </div>
            </div>
         
        </div>
    </section>

    <section className="py-5 bg-white">
    <div className="container">

        <div className="text-center mb-5">
            <small className="text-uppercase fw-bold text-muted">
                
                {content?.heres_what_inside?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("heres_what_inside") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </small>

            <div className="mt-4">
                <img src={content?.public_speaking_mstclss_img?.section_image??""}
                     className="img-fluid rounded-4 shadow"
                     style={{maxWidth:"550px"}}
                     alt="Public Speaking MasterclassName" /> 
                          <button 
        onClick={()=>EditorImage("public_speaking_mstclss_img") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Change Image</button>
            </div>

            {/* <p className="lead mt-4"> 
                {content?.you_ll_move_thru?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("you_ll_move_thru") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </p> */}
        </div>

        <div className="row g-4 justify-content-center">

            {/* <!-- Module 1 --> */}
            {/* <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm h-100 text-center rounded-4">

                    <div className="card-body p-4">

                        <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-4"
                             style={{width:"60px;",height:"60px"}}>
                            1
                        </div>

                        <h5 className="fw-bold">
                            The Magnetic Presence Formula
                        </h5>

                        <p className="text-muted small">
                            Learn how to open strong, hold attention,
                            and project calm confidence from the first word.
                        </p>

                    </div>

                </div>
            </div> */}

            {/* <!-- Module 2 --> */}
            {/* <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm h-100 text-center rounded-4">

                    <div className="card-body p-4">

                        <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-4"
                             style={{width:"60px",height:"60px"}}>
                            2
                        </div>

                        <h5 className="fw-bold">
                            The Persuasion Blueprint
                        </h5>

                        <p className="text-muted small">
                            Discover storytelling techniques and emotional
                            triggers that make your ideas unforgettable.
                        </p>

                    </div>

                </div>
            </div> */}

            {/* <!-- Module 3 --> */}
            {/* <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm h-100 text-center rounded-4">

                    <div className="card-body p-4">

                        <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-4"
                             style={{width:"60px;", height:"60px;"}}>
                            3
                        </div>

                        <h5 className="fw-bold">
                            The Closing Mastery Method
                        </h5>

                        <p className="text-muted small">
                            Finish every presentation with confidence,
                            clarity and a memorable call to action.
                        </p>

                    </div>

                </div>
            </div> */}

        </div>

        <div className="text-center mt-5">
            <a href="#" className="btn btn-warning px-5 rounded-pill fw-semibold text-black">
                
                
                {content?.get_instant_access_word?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("get_instant_access_word") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </a>
        </div>

    </div>
</section>



{/* <!-- About Coach --> */}
<section className="py-5" style={{background:"#22070A;"}}>
    <div className="container">

        <div className="row align-items-center g-5">

            <div className="col-lg-5 text-center">

                <img src={content?.public_coach_mstclss_img?.section_image}
                     className="img-fluid"
                     style={{maxHeight:"520px;"}}
                     alt="x" />
                        <button 
        onClick={()=>EditorImage("public_coach_mstclss_img") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Change Image</button>

            </div>

            <div className="col-lg-7 text-white">

                <span className="badge bg-warning text-dark mb-3 px-3 py-2"> 
                {content?.meet_your_coach?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("meet_your_coach") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
                </span>

                <h2 className="fw-bold mb-4">
                   
                {content?.i_am_coach_h?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("i_am_coach_h") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
                </h2>

                <p className="text-white-50">
                    
                {content?.for_years_ive_helped_profs?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("for_years_ive_helped_profs") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
                </p>

                <p className="text-white-50">
                    
                    
                {content?.after_years_of_coaching?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("after_years_of_coaching") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
                </p>

                <p className="text-white-50 mb-4">
                    
                {content?.thats_why_self_paced?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("thats_why_self_paced") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
                </p>

                <div className="d-flex flex-wrap align-items-center gap-3">

                    <div className="bg-warning text-dark fw-bold px-4 py-3 rounded-pill">
                        
                {content?.k_students_enrolled?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("k_students_enrolled") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
                    </div>

                    <a href="#" className="btn btn-outline-light rounded-pill px-4">
                        Join Today
                    </a>

                </div>

            </div>

        </div>

    </div>
</section>
 
        
        </section>
        


    <section className="pricing-banner text-center">
        <div className="container">
            <h3 className="price-text mb-3"><em>{content?.getInstantAccess?.section_text ?? ""}</em> 
            
                {content?.to_the_course_below?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("to_the_course_below") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </h3>
            <p className="banner-subtext mb-2"> 
                {content?.start_learning_now?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("start_learning_now") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </p>
            <p className="banner-subtext mb-2">
                
                {content?.enroll_now_to_join?.section_text ?? ""}
                          <button 
        onClick={()=>EditorContent("enroll_now_to_join") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>

            </p>
            <div>
                <a href="#" className="btn-cta-yellow">
                    {content?.get_access_1k?.section_text ?? ""}
                </a>
                
                
                          <button 
        onClick={()=>EditorContent("get_access_1k") }
        className="btn btn-sm btn-secondary"
        ><i className="bi bi-pencil-fill"></i> Edit</button>
            </div>
        </div>
    </section>
        
    {/* <!-- Footer --> */}
    <footer className="text-center py-3">
        <div className="container">
            <p className="mb-0 small opacity-75">
                © {currentYear} ,public speaking masterclass,All Rights Reserved.
            </p>
        </div>
    </footer>

    
            {modal && (
                <ContentEditModal
                enquiry={modal}
                onClose={() => setModal(null)}
                onSave={handleModalSave} 
                />
            )}
    
            {imgModal && (
                <ImageEditModal
                enquiry={imgModal}
                onClose={() => setImgModal(null)}
                onSave={handleModalSave} 
                />
            )}
            {yts && (
                <ContentEditYTSModal
                enquiry={yts}
                onClose={() => setYTS(null)}
                onSave={handleModalSave} 
                />
            )}
            {contentWithTitle && (
                <ContentEditAchievementsModal
                enquiry={contentWithTitle}
                onClose={() => setcontentWithTitle(null)}
                onSave={handleModalSave} 
                />
            )}
        
                    <JqueryMin />
                    <BootstrapBundle />
                    <MomentMin />
                    <OverlayScrollbarsInit /> 
                    <CustomMin />
        </>
    );
}