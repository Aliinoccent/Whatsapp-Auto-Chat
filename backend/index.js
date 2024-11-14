var express = require("express"),
    bodyParser = require("body-parser");


var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (request, response) {
    response.send(
        "Simple WhatsApp Webhook tester</br>There is no front-end, see server.js for implementation!"
    );
});

app.get("/webhook", function (req, res) {
    try {
        if (
            req.query["hub.mode"] == "subscribe" &&
            req.query["hub.verify_token"] == "token"

        ) {
            res.send(req.query["hub.challenge"]);
            console.log('if')
        } else {
            res.sendStatus(400);
            console.log('else')
        }
    }
    catch (error) {
        console.log(error)
    }

});
const sendMessage = async (phoneid, phone, UserName, messege) => {
    let data = {}
    const url = `https://graph.facebook.com/v16.0/${phoneid}/messages`;
    if (messege === 'Projects') {
        data = {
            messaging_product: "whatsapp",
            to: phone,
            type: "text",
            text: {
                body: `Hello dear ${UserName}, 
At Saiban Associates, we bring you prime land investment opportunities with a commitment to quality, transparency, and growth. Our projects are thoughtfully designed to offer exceptional value in thriving communities, making them ideal for those seeking both immediate living spaces and long-term investments. Saiban Associates takes pride in fostering reliable relationships and delivering projects that elevate the lifestyle of our clients. Explore our meticulously planned societies, where modern amenities meet serene landscapes, ensuring a promising future for you and your family. Visit Saiban Associates to discover your next investment opportunity with a trusted name in real estate.`
            }
        };
    }
    else if (messege === 'Contact Us') {
        data = {
            messaging_product: "whatsapp",
            to: phone,
            type: "text",
            text: {
                body: `Hello dear ${UserName}, Saiban Associates
📍 Address: Office # C 09, Sector 4, Civic Center, Bahria Town, Karachi
📞 Phone: +92 309 4028763
🌐 Website: www.saiban.pk
📧 Email: info@saiban.pk`
            }
        }
    }
    else if (messege === 'Services') {
        data = {
            messaging_product: "whatsapp",
            to: phone,
            type: "text",
            text: {
                body: `Hello dear ${UserName}, At Saiban Associates, we offer a range of comprehensive real estate services to meet your investment and property needs:

1. **Real Estate Consultation**  
   - Our experienced consultants provide expert advice on real estate trends, investment opportunities, and property valuations to help you make informed decisions.

2. **Property Buying & Selling**  
   - Whether you're buying your dream property or selling your current one, we assist with all the processes to ensure smooth and secure transactions.

3. **Project Marketing & Promotion**  
   - We specialize in the marketing and promotion of residential and commercial projects, helping developers reach their target audience effectively.

4. **Investment Planning**  
   - We provide personalized investment plans to help clients maximize their returns, tailored to individual financial goals and market conditions.

5. **Legal and Documentation Services**  
   - Our team ensures all legal requirements are met, including property registration, title verification, and other necessary documentation for a hassle-free experience.

6. **Property Management**  
   - For clients who need ongoing management, we offer maintenance, rent collection, and tenant management to keep your investment secure and profitable.

For more details on our services or to schedule a consultation, please visit our website or contact us directly. Saiban Associates is here to guide you every step of the way in your real estate journey.`
            }
        };

    }
    else {
        data = {
            messaging_product: "whatsapp",
            to: phone,
            type: "template",
            template: {
                name: "services",
                language: {
                    code: "en_us"
                },
                components: [
                    {
                        type: "header",
                        parameters: [
                            {
                                type: "image",
                                image: {
                                    link: "https://lh3.googleusercontent.com/p/AF1QipPa1q4XgkABhp1_YGMed_Vug42hvW9PI0qmI_BB=s1360-w1360-h1020"
                                }
                            }
                        ]
                    }
                ]
            }
        };
    }



    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EAAaIYBUmFwwBO4NeGqymBu9q6HVgIEZCAt2tilhfU916ZAayQgPiwF8g7aG3eS0fxXumjcdeVWWIyyAhmZCLsSgyCR0GFR7tpZBDZCFZB2E529resiBsfMgFFg8GZBstZBWQCbweIvfp7oZCervbBOBfjsfFX8QwGvaymJRQdNZAqiS7vEZCz5hKLqZC3U75areZBu89TsbK7Iq8yEkAHaXjikDHRpOUEonEZD'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const responseData = await response.json();
            console.log('Message sent successfully:', responseData);
        } else {
            throw new Error('Failed to send message, status code: ' + response.status);
        }
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
};

app.post("/webhook", function (request, response) {
    try {
        console.log("Incoming webhook: " + JSON.stringify(request.body));
        const responseData = request.body;
        response.sendStatus(200);
        if (
            responseData.entry &&
            responseData.entry[0] &&
            responseData.entry[0].changes &&
            responseData.entry[0].changes[0] &&
            responseData.entry[0].changes[0].value &&
            responseData.entry[0].changes[0].value.metadata &&
            responseData.entry[0].changes[0].value.contacts &&
            responseData.entry[0].changes[0].value.contacts[0]
        ) {
            const metadata = responseData.entry[0].changes[0].value.metadata;
            const contacts = responseData.entry[0].changes[0].value.contacts[0];
            const messages = responseData.entry[0].changes[0].value.messages[0]
            const phoneNumberId = metadata.phone_number_id;
            const profileName = contacts.profile.name;
            const phoneNumber = contacts.wa_id;
            const message = messages.button?.payload ?? 'nothing';
            console.log(phoneNumberId, phoneNumber, profileName, message);
            sendMessage(phoneNumberId, phoneNumber, profileName, message);
        } else {
            console.error("Unexpected webhook data structure", responseData);
        }
    }
    catch (error) {
        console.error("Error processing webhook:", error);
    }
});


var listener = app.listen(3000, function () {
    console.log("Your app is listening on port " + listener.address().port);
});
