const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");
const { getTransporter } = require("../config/mailer");

const assetsDir = path.join(__dirname, "../assets/email");

let qrBufferPromise;

// El QR es el mismo para todos los invitados, así que se genera una sola vez.
function getQrBuffer() {
  const target = process.env.QR_TARGET_URL;
  if (!target) {
    console.warn("Falta QR_TARGET_URL: el email se enviará sin QR.");
    return Promise.resolve(null);
  }
  qrBufferPromise ??= QRCode.toBuffer(target, { width: 320, margin: 1 });
  return qrBufferPromise;
}

function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}

function inlineImage(filename, cid, alt) {
  const filePath = path.join(assetsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`Falta la imagen del email: ${filePath}`);
    return null;
  }
  return {
    html: `<img src="cid:${cid}" alt="${alt}" width="600" style="display:block;max-width:100%;height:auto;margin:0 auto 16px;">`,
    attachment: { filename, path: filePath, cid },
  };
}

function ticketRow(color, label, value) {
  return `<p style="margin:0 0 14px;"><span style="color:${color};font-weight:bold;font-size:20px;">${label}</span> <strong>${value}</strong></p>`;
}

async function sendTicketEmail(guest) {
  const transporter = getTransporter();
  if (!transporter) return;

  const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER;
  const subject =
    `TU ENTRADA | RAMONA Y ALBINO CHRISTMAS FEST 🎄`;

  const salutation = `Hola, <strong><span style="color: #e65348;">${escapeHtml(guest.name)}</span></strong>, gracias por comprar a través de nuestra web. Aquí tienes tu entrada para el HelenFest`;

  const salutation2 = `¡Esta Navidad necesitaba un milagro…y se ha hecho realidad! <strong>RAMONA Y ALBINO</strong> vuelven a los escenarios con su gira <strong>FELICITÁ CHRISTMAS TOUR 2026</strong>!`;
  const salutation3 =
    "Así que aquí tienes tu entrada para el <strong>RAMONA Y ALBINO CHRISTMAS FEST</strong> 🎄🎉.";

  const generalCondition = `
  <div style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.6; color: #222; text-align: justify;">

    <p>
      <strong>🎟️ &nbsp;01. BILLETE DE ACCESO A LA MÁS EXCELSA MANIFESTACIÓN DEL JÚBILO NAVIDEÑO</strong><br>
      Esta entrada incluye una experiencia navideña de exquisita distinción e insuperable valor sentimental, llena de esparcimiento,
       jolgorio, regocijo y gozosa convivencia. Exprime al máximo la magnífica oportunidad de celebrar juntos esta navidad jubilosa.
        Mariah Carey ya está descongelada, tú verás si estás a la altura!. “And remember”: All I want for Christmas……….. is YOU!!!!!
    <br>
      <strong>🍰 &nbsp;02. PROTOCOLO DE ABASTECIMIENTO GASTRONÓMICO Y ESPIRITUOSO</strong><br>
      Recuerda que <strong>RAMONA Y ALBINO CHRISTMAS FEST</strong> es un festival de alta gastronomía colaborativa de andar por casa,
       así que cada FANSSS deberá traer algo sabroso y alguna bebida con más o menos espírituosidad, según congratulación personal.
        Se recuerda que la dieta, de toda la vida, empieza «en enero», por lo que las generosas contribuciones al festín navideño 
        serán recibidas con alegría y <del>entusiasmo</del> (¡hambre, mucha hambre!).
      
   <br>
      <strong>🎶 &nbsp;03. ¡QUE RESUENEN LOS CÁNTICOS HASTA EN EL PORTAL DE BELÉN!</strong><br>
      Durante el desarrollo conciertístico, se exigirá entrega vocal absoluta, entusiasmo desmedido y algún que otro falsete que pueda
       despertar al niñito Jesús. Si no te sabes la letra, tú improvisa, que total no se nota… La organización valorará positivamente
        la entrega de sus <strong>FANSES</strong> y mostrará descarada predilección por aquellos que más se hagan notar 
        (<u>fomentamos activamente la competitividad</u>).
    <br>
      <strong>🎤 &nbsp;04. KARAOKE: GLORIA VOCAL Y DESENFRENO INTERPRETATIVO</strong><br>
      Al karaoke se viene a dis-fru-tar. Se ruega despliegue de carisma y ausencia absoluta de modestia. Que cojas el micro, coño,
       ¡no muerde!, y destroza sin piedad esos temazos que tantas alegrías han dado a la humanidad. Y recuerda: se perseguirá cualquier
        sospecha de ensayo previo. Los FANSES traidores podrán ser sancionados con la interpretación de una canción sorpresa, elegida
         meticulosamente por la organización (spoiler: la tal «dignidad» esa no sobrevivirá).
    <br>
      <strong>🏆  &nbsp;05. ALBINO DE ORO: HONORES A LA MÁS SOBERBIA EXHIBICIÓN DE ATAVÍO NAVIDEÑO</strong><br>
      Se convoca el <strong>CONCURSO DE LUCS NAVIDEÑOS</strong> (<em>de participación voluntaria</em>), y con ello se autoriza el paso
       a la alta costura Brilli-Brilli Christmas 100 % poliéster: Jerseys de renos, gorros de Papá Noel, luces LED, espumillón y 
       cualquier otro tipo de atrocidad navideña serán más que bienvenidos… No olvides que este es un Festival de Navidad, 
       ¡With the music, with the lights!. Un jurado de más que dudosa imparcialidad elegirá al concursante FANSS más excesivo, 
       hortera y deslumbrantemente navideño, que tendrá el honor de recibir el legendario <strong>ALBINO DE ORO</strong>, galardón
        de extraordinaria magnificencia y dudosa utilidad práctica.
    <br>
    Se valorarán el exceso, las horteradas y el despilfarro eléctrico. ¡Con el patrocinio oficial de Abel Caballero!
    <br>

      <strong>📸  &nbsp;06.  ¡EL BOCHORNO ES EFÍMERO, LAS FOTOS ETERNAS!</strong><br>
     Aquí se viene a hacer el ridículo… ¡y a dejar constancia gráfica! Se ruega colaboración activa en la producción de material gráfico y audiovisual de dudoso valor artístico, pero de incalculable potencial como joyas para el recuerdo colectivo cuyo disfrute estará sujeto a la posición que cada cual ocupe en tan ilustres documentos (víctima o perpetrador, jeje). No te cortes, déjate llevar, suéltate la melena (y si no tienes, pues la espiritual), desempolva tus mejores movimientos de cadera y olvida por un rato que eres adulto. ¡Ven a pasártelo teta!
    
    <br>
    <br>
 <strong>¡FELICITÀ PARA TODOS Y VIVA VIGO!</strong> 
 <br>
    <br>
      <strong>🎄  &nbsp; A COMISIÓN DE FESTAS DO RAMONA Y ALBINO CHRISTMAS FEST  &nbsp; 🎄 </strong>
    </p>

  </div>
`;
  const legalNotice = `
    <p style="font-size: 10px; color: #888888; text-align: justify;">
      Este mensaje puede contener información inventada y de dudosa confidencialidad. Si Ud. No es el destinatario 
      (o el elfo encargado de hacer llegar este mensaje al destinatario), le informamos que está totalmente prohibida cualquier 
      utilización, divulgación, distribución y/o reproducción de esta entrada. No queremos patrocinar un “Si me queréis, irse”,
       que en plenas fiestas el precio de las gambas está por las nubes. Si ha recibido este mensaje por error, rogamos proceda a
        su destrucción. El tratamiento de datos se realizará de forma confidensial y de conformidad con la normativa vigente. Ud. 
        Podrá ejercer el derecho de rectificación, limitación y cancelación de sus datos en los términos establecidos en la Ley Orgánica
         3/2018, del 5 de diciembre, de Protección de Camellos personales y Garantía de los Villancicos Desafinados, otra cosa es que 
         le hagamos caso, porque una vez que se ha apuntado, ahora tiene que venir.  La organización no se responsabiliza de posibles
          daños psicológicos o reputacionales derivados de la participación en ninguna de las actividades organizadas en el 
          RAMONA Y ALBINO CHRISTMAS FEST, ni de la existencia de imágenes o videos que pongan en compromiso la dignidad de los
           participantes. En todo caso, rogamos nos hagan llegar adjuntos los vídeos comprometedores o fotografías especialmente 
           desfavorecedoras motivo de la reclamación (no lo valoraremos, solo es para reírnos, por si no lo teníamos todavía). 
            Se reserva el derecho de admisión, en caso de detectar negativa en participación activa en el evento puede resultar 
            expulsado del recinto con una patadita en el culito y, por supuesto, sin polvorón para el caminito. Se recuerda que pese 
            el derroche de luces esto no es Vigo, simplemente es una celebración navideña de la amistad. No se aceptarán reclamaciones 
            de última hora ante los Reyes Magos, hubiese sido bueno el resto del año. <a href="https://www.ramonayalbino.es"
         target="_blank"
         style="color: #000000; font-weight: bold; text-decoration: none;">
        RamonayAlbino.es
      </a>
    </p>
  `;

  const headerImage = inlineImage(
    "congrats.jpg",
    "congrats",
    "¡Ya tienes entrada!",
  );

  const qrBuffer = await getQrBuffer();
  const qrCell = qrBuffer
    ? `<img src="cid:qr" alt="QR de tu entrada" width="160" style="display:block;margin:0 auto;">`
    : "";

  const attachments = [
    ...(headerImage ? [headerImage.attachment] : []),
    ...(qrBuffer ? [{ filename: "qr.png", content: qrBuffer, cid: "qr" }] : []),
  ];

  const ticketTable = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:none;margin:24px 0;font-family:Arial,Helvetica,sans-serif;color:#222222;">
      <tr>
        <td align="center" valign="middle" style="padding:16px;">${qrCell}</td>
      </tr>
        <tr>
        <td valign="middle" style="padding:20px 24px;font-size:16px;line-height:1.5;">
          ${ticketRow("#e65348", "INCLUYE:", "ACCESO - RAMONA Y ALBINO CHRISTMAS FEST 🎄 ")}
          ${ticketRow("#e65348", "NOMBRE:", escapeHtml(guest.name))}
          ${ticketRow("#e65348", "CORREO:", escapeHtml(guest.email))}
          ${ticketRow("#e65348", "APORTACION CULINARIA SÓLIDA:", escapeHtml(guest.dish))}
          ${ticketRow("#e65348", "APORTACION CULINARIA LÍQUIDA:", escapeHtml(guest.drink))}
          ${ticketRow("#e65348", "FECHA Y HORA:", "12 DE DICIEMBRE 2026 – 13H.")}
          ${ticketRow("#e65348", "RECINTO:", "vivienda unifamiliar ubicada en O MARQUIÑO CITY CENTER (en breve recibirás información sobre las áreas de aparcamiento habilitadas y los accesos al recinto)")}
        </td>
      </tr>
    </table>
  `;

  await transporter.sendMail({
    from: `"HelenFest" <${fromAddress}>`,
    to: guest.email,
    bcc: process.env.MAIL_BCC || "",
    subject: subject,
    attachments,
    html: `
      <div style="font-family: sans-serif; color: #1b1633; background-color: #ffffff;">
        ${headerImage ? headerImage.html : ""}
        <p style="text-align: justify;">¡${salutation}!</p>
        <p style="text-align: justify;">${salutation2}</p>
        <p style="text-align: justify;">${salutation3}</p>
        ${ticketTable}
        <h3 style="color: #e65348 ; font-size: 14px;">CONDICIONES GENERALES</h3>
        <hr style="border: 0; border-top: 1px solid #cccccc;">
        ${generalCondition}
        
        <hr style="border: 0; border-top: 1px solid #cccccc; margin-top: 28px;">
        ${legalNotice}
      </div>
    `,
  });
}

module.exports = { sendTicketEmail };
