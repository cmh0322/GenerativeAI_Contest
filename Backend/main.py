import openai
import firebase_admin
from firebase_admin import credentials, firestore, storage
from config import *
from flask import Flask, request, jsonify
from flask_cors import CORS


# 1. Firebase 및 OpenAI 초기화
cred = credentials.Certificate(FIREBASE_SERVICE_ACCOUNT_PATH)
firebase_admin.initialize_app(cred, {'storageBucket': FIREBASE_STORAGE_BUCKET})
db = firestore.client()
bucket = storage.bucket()
openai.api_key = OPENAI_API_KEY

class MindStepBackend:
    def __init__(self, patient_id):
        self.patient_id = patient_id

    def process_counseling(self, audio_file_path):
        """상담 음성을 처리하여 분석 및 영상 생성 프롬프트 도출"""
        
        # [Step 1] Whisper를 이용한 STT 변환 [cite: 54, 65]
        audio_file = open(audio_file_path, "rb")
        transcript = openai.Audio.transcribe("whisper-1", audio_file)
        text_content = transcript['text']

        # [Step 2] GPT-4o를 이용한 키워드 및 심리 분석 [cite: 82, 128]
        # PDF에 정의된 '감각, 신체, 인지, 감정, 회피' 카테고리별 분석 수행 [cite: 83-91]
        analysis_result = self.analyze_with_gpt4o(text_content)

        # [Step 3] Firebase Firestore에 분석 결과 저장 [cite: 231]
        self.save_to_firestore(analysis_result)

        # [Step 4] 맞춤형 영상 생성 프롬프트 추출 [cite: 147, 151]
        video_prompt = analysis_result['video_gen_prompt']
        
        return video_prompt

    def analyze_with_gpt4o(self, text):
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 PTSD 전문의입니다. 상담 내용을 분석하여 감각, 신체, 인지, 감정, 회피 키워드를 추출하고 치료용 영상 생성을 위한 상세 프롬프트를 작성하세요. [cite: 43, 82]"},
                {"role": "user", "content": f"상담 내용: {text}"}
            ]
        )
        # 실제 구현 시 JSON 파싱 로직 추가
        return response.choices[0].message.content

    def save_to_firestore(self, data):
        """환자별 상담 데이터 저장 [cite: 118, 125]"""
        doc_ref = db.collection('patients').document(self.patient_id).collection('sessions').document()
        doc_ref.set(data)

    def upload_video_to_firebase(self, video_url, session_id):
        """생성된 치료 영상을 스토리지에 저장하고 링크 업데이트 [cite: 62, 116]"""
        # API로 생성된 영상(Luma/Runway)을 다운로드 후 Firebase Storage에 업로드하는 로직
        blob = bucket.blob(f"videos/{self.patient_id}/{session_id}.mp4")
        # blob.upload_from_filename(...)
        return blob.public_url

app = Flask(__name__)
CORS(app) # 프론트엔드와 백엔드 통신 허용

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    backend = MindStepBackend("kim_jisu_01") # 임시 ID [cite: 38]
    # 실제로는 스토리지에서 파일을 다운로드하는 로직이 필요합니다.
    result = backend.process_counseling("downloaded_audio.wav")
    return jsonify({"prompt": result})

if __name__ == '__main__':
    app.run(port=5000)

# 실행 예시
# backend = MindStepBackend("kim_jisu_01")
# prompt = backend.process_counseling("session_audio.mp3")