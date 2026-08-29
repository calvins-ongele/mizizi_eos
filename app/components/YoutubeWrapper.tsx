import { title } from "process";

export function YoutubeWrapper(lnk:{link:string}) {
    //lnk = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ

    const spl = lnk.link.split('='); 
    const ytId = spl[1] ?? '';

    return ( 
        <div className="video-wrapper mb-4"> 
            <div className="ratio ratio-16x9"> 
                <iframe 
                    src={`https://www.youtube.com/embed/${ytId}`} 
                    title="Own Your Voice Masterclass" 
                    allowFullScreen={true} >
                </iframe>
            </div>
        </div>
    );
}

export function YoutubeWrapperLinks(lnk:{link:string}) {

    const links = lnk.link.split(','); 

    return (
        <>
        
            { links.map((row, i) => (
                
                <div className="col-md-6" key={i}>
                    <div className="testimonial-video-card">
                        <div className="ratio ratio-16x9">
                            {/* <!-- Replace src with your YouTube embed link --> */}
                            <iframe 
                                src={`https://www.youtube.com/embed/${row.split('=')[1]}`} 
                                title="Speak to Lead Testimonial 3" 
                                allowFullScreen={true} >
                            </iframe>
                        </div>
                    </div>
                    
                </div>
                
            ))}

        </> 
   
    );

}

export function Achievements(data:{titles:string, texts:string} ) {

    const titleRows = data.titles.split('{{sep}}');
    const textRows = data.texts.split('{{sep}}'); 

    return (
        <>
        {
            titleRows.map((title, idx) => (
                <div className="col-md-6" key={idx}>
                    <div className="feature-card">
                        <div className="feature-card-header">
                            <i className="fa-solid fa-circle-check"></i>
                            <span>{title}</span>
                        </div>
                        <div className="feature-card-body">
                            {textRows[idx]}
                        </div>
                    </div>
                </div>

            ))
        }
                
        </>
    );
}

