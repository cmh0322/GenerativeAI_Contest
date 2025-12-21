import firebase_admin
from firebase_admin import credentials, storage, db
import whisper
from openai import OpenAI
import os
import requests
import time

# --- 1. 초기 설정 ---
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'YOUR_PROJECT_ID.appspot.com',
    'databaseURL': 'https://YOUR_PROJECT_ID.firebaseio.com'
})

client = OpenAI(api_key="YOUR_OPENAI_API_KEY")
LUMA_API_KEY = "YOUR_LUMA_API_KEY"

def generate_video_with_luma(prompt):
    """Luma AI API를 사용하여 고화질 영상 생성 요청"""
    url = "https://api.lumalabs.ai/vincent/v1/generation"
    headers = {"Authorization": f"Bearer {LUMA_API_KEY}"}
    payload = {"prompt": prompt, "aspect_ratio": "16:9", "quality": "high"}
    
    response = requests.post(url, json=payload, headers=headers)
    return response.json().get("id")

def process_pipeline(file_path, bpm_data):
    print("--- 2단계: STT 변환 시작 (Whisper) ---")
    model = whisper.load_model("base")
    transcript = model.transcribe(file_path)["text"]

    print("--- 3단계: AI 심리 분석 및 시네마틱 프롬프트 생성 ---")
    system_prompt = "당신은 PTSD 치료를 위한 영화 감독입니다. 심박수와 상담 내용을 바탕으로 환자의 치유를 돕는 초현실적이고 시네마틱한 영상 프롬프트를 영어로 작성하세요."
    user_prompt = f"상담내용: {transcript}\n평균심박수: {bpm_data}\n\n결과를 JSON 형식으로 'prompt' 키에 담아줘."
    
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]
    )
    video_prompt = completion.choices[0].message.content

    print(f"생성된 프롬프트: {video_prompt}")

    print("--- 4단계: 클라우드 영상 생성 요청 (Luma/Runway) ---")
    video_id = generate_video_with_luma(video_prompt)
    print(f"영상 생성 시작됨. 작업 ID: {video_id}")

# Firebase Storage 감시 루프
def monitor_storage():
    bucket = storage.bucket()
    print("Firebase Storage 모니터링 중...")
    
    # 단순화된 로직: 특정 경로에 파일이 있는지 주기적으로 체크
    while True:
        blobs = bucket.list_blobs(prefix="recordings/")
        for blob in blobs:
            local_file = f"./recordings/{blob.name.split('/')[-1]}"
            blob.download_to_filename(local_file)
            
            # DB에서 해당 세션의 BPM 데이터 가져오기
            bpm_val = db.reference("/live_session/bpm").get()
            
            process_pipeline(local_file, bpm_val)
            blob.delete() # 처리 후 삭제
        time.sleep(10)

if __name__ == "__main__":
    if not os.path.exists("./recordings"): os.makedirs("./recordings")
    monitor_storage()