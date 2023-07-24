exports.handler = async (event, context) => {

    const message = event.Records[0].Sns.Message;
    const topic = event.Records[0].Sns.TopicArn;
    console.log(`from topic ${topic}. message: ${message}`);
    return message;
};
