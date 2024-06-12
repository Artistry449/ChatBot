const request = require('supertest');
const app = require('./../app'); // Ensure this points to your app's entry point

describe('Chatbot API', () => {
    it('should return client\'s wanted choice', async () => {
        const response = await request(app)
            .post('/webhook')
            .send({
                type: 'message.new',
                cid: 'messaging:SERVER_TEST_HHE',
                channel_id: 'SERVER_TEST_HHE',
                channel_type: 'messaging',
                message: {
                    id: '0fda43d2-9af9-44c4-8caa-c230e6047d87',
                    text: 'Түвшин 2 хүсэлтээ яаж илгээх вэ?',
                    html: '<p>Түвшин 2 хүсэлтээ яаж илгээх вэ?</p>\n',
                    type: 'regular',
                    user: {
                        id: '1',
                        role: 'user',
                        name: 'Emily'
                    },
                    choice_id: 22
                },
                channel: {
                    id: 'SERVER_TEST_HHE',
                    type: 'messaging',
                    cid: 'messaging:SERVER_TEST_HHE',
                },
                user: {
                    id: '1',
                    role: 'user',
                    name: 'Emily'
                }
            });
        console.log("AAAAAAAA");
        console.log(response.status);
        expect(response.status).toBe(200);
        // Add more assertions based on your API response
    }, 10000);
});
