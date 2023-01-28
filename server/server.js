import { handler } from './build/handler.js';
import express from 'express';
import nodemailer from "nodemailer";
import axios from "axios";
import util from "util";
 
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// let users=['aravasaiteja@gmail.com','saiteja.a@keus.in'];
let users=['b.rajeshwari@keus.in','tanveer.keus@gmail.com'];


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'info@keus.in',
      pass: 'Keus@12345678'
  }
});

const buildHTML = function(contactInfo) {
  var finalHTML = '';

  finalHTML += 'Name: ' + contactInfo.name + '<br />';
  finalHTML += 'Phone: ' + contactInfo.phone + '<br />';
  finalHTML += 'Email: ' + contactInfo.email + '<br />';
  finalHTML += 'PropertyType: ' + contactInfo.ptype + '<br />';
  if(contactInfo.psize)
    finalHTML += 'PropertySize: ' + contactInfo.psize + '<br />';
  if(contactInfo.soc)
    finalHTML += 'StageOfConstruction: ' + contactInfo.soc + '<br />';

  return finalHTML;
};

app.post('/api/bookAppointment', (req, res) => {
      const mailOptions = {
        from: 'KeusWebsite <info@keus.in>', // sender address
        to: users, // list of receivers
        subject: 'Website - ScheduleDemo - ' + req.body.name, // Subject line
        html: buildHTML(req.body)// plain text body
    };

    axios({
      method: 'post',
      url: 'https://keus-odoo-keus-v13-master-1223966.odoo.com/api/crm.lead/create',
      headers: { 'content-type': 'application/json' },
      data: {
        params: {
          vals: {
            contact_name: req.body.name,
            mobile: req.body.phone,
            email_from: req.body.email,
            property_type: req.body.ptype,
            source_type: "Facebook",
            medium_type: "Tez",
            campaign_type: "E-service",
            content_type: "Tools",
            description: req.body?.message? req.body.message:""
          },
          token: "Webs!teLe@d"
        }
      }
        }).then(function(resp) {
      console.log('saving lead to odoo completed', resp);
      console.log(util.inspect(resp.data, false, null, true /* enable colors */))
        }).catch(function(err) {
      console.log('Error saving to odoo', err);
        });

    transporter.sendMail(mailOptions, function (err, info) {
        if(err) {
            console.log(err)
            res.send({success: false, error: 'Failed to Send'});
        } else {
            console.log(info);
            res.send({success: true});
        }
    });
});

app.use(handler);

app.listen(3000, () => {
  console.log('listening on port 3000');
});