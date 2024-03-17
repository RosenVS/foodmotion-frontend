import React from 'react';

import { Container } from '@mui/system';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import '../css/homepage.css';


export default function Homepage() {

  return (
    <Container >
      <br/>
    <Box className="segment-one">
    <div className="flex-segment">
      <div >
        <img src="https://cdn.pixabay.com/photo/2016/03/04/19/36/beach-1236581__480.jpg" alt="Where are we located"/>
      </div>
      <div className="content-container">
        <p>Opic na yarose cusi, cienisu libinu gute. Tirolen locet osuse arogutaf afa tinote toneyep esis.</p>
        <Button variant="outlined" className="learn-more-btn segment-one-btn">Learn more</Button>
      </div>
    </div>
  </Box>

  <Box className="segment-two">
    <div className="flex-segment segment-two-flex-group">
      <div>
        <img src="https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60" alt="How did we start"/>
      </div>
      <div className="content-container">
        <p>Otalabe gaboro oko reso senev ihonawat pudep enip? Inorop amire nari nanupel cerolit tegepib? Bewecaf nuligun ener cela eposul losuqe ero pi gocel narired. Wete osasite wub. Nip lofe yen lo bapeno.</p>
        <Button variant="outlined" className="learn-more-btn section-four-btn">Read more</Button>

      </div>
    </div>
  </Box>
  <Box className="section-one">
    <div className="flex-segment">
      <div>
        <img src="https://cdn.pixabay.com/photo/2017/10/20/01/06/north-star-2869817__480.jpg" alt="What do we do"/>
      </div>
      <div className="content-container">
        <p>Yepe hepop ramef razek hoconem tipacut lemeg? Mana ilic tut edar aheg. Far ieripep ranec haloro. Si te rot. Ikoh apam tasifed ce pieno lo na. Rem tid papo gel ilodil! Ite tot uti rolet onaserag obopased riki tedakad. Lamin gisa era sidof nineh. Laga rona elirew cuye bip muso ten masec sehe nacihieh.</p>
        <Button variant="outlined" className="learn-more-btn section-one-btn">Learn more</Button>
      </div>
    </div>
  </Box>

      <br/>
    <h2 className="newSection">Locations</h2>


  <Box className="section-three">
    <div className="flex-group-three">
      <div>
        <img src="https://plus.unsplash.com/premium_photo-1664439520373-c832fe4c3186?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cmFuZG9tfGVufDB8MnwwfHw%3D&auto=format&fit=crop&q=60" alt="Eindhoven location"/>
        <h4>Eindhoven</h4>
        <p>Se tol lelari hanarop gi sesat xekef gagerar emitihi nuq; legav reyipo cepiesit mega nebenoc ised. Erufelo behedu voru retiya ror celoce. Kir da letep mirasa dasop ozitomit mor. Nahital ni ga enag etiden nam arahido odedoce liewo rerep. Hidelan ihotien sogieh ro sied; eco netifer le hori ieniti tini ule licut iecas! Gelon pena locug.</p>
      </div>
      <div>
        <img src="https://images.unsplash.com/photo-1666845267403-191d298cf198?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Njk2OTEzOTc&ixlib=rb-4.0.3&q=80" alt="Amsterdam location"/>
        <h4>Amsterdam</h4>
        <p>Ariceno ilocet hape; lus lolato ne ta renapi. Riro moc linulo na. Riran ecat iraro yeto lu. Be side inihawew hibe tet nonato imop inor hati tire. Mehanag tepupu sena rasose cacero moresa suc yenar so retes? Uriro ha vucafet iledi? Rorunow dem gin negirap kidi! Isetep narinec sapiv parid fam viri gosi se. Ucerupo isuh neg letap.</p>
      </div>
    </div>
  </Box>
      <button className="newSection contactUsButton"> Contact us</button>
      <br/>
      <br/>
    </Container >
  );
}
