import avt_1 from "../avatars/avt_1.png";
import avt_2 from "../avatars/avt_2.png";
import avt_3 from "../avatars/avt_3.png";
import avt_4 from "../avatars/avt_4.png";
import avt_5 from "../avatars/avt_5.png";
import avt_6 from "../avatars/avt_6.png";
import avt_7 from "../avatars/avt_7.png";
import avt_8 from "../avatars/avt_8.png";
import avt_9 from "../avatars/avt_9.png";
import avt_10 from "../avatars/avt_10.png";

function RandomPicture() {
  const pictures = [avt_1, avt_2, avt_3, avt_4, avt_5, avt_6, avt_7, avt_8, avt_9, avt_10];
  return pictures[Math.floor(Math.random() * 10)];
}

export default RandomPicture;
