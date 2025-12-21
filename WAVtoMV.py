import serial
import struct
import time
import wave
import whisper
from openai import OpenAI
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips

# --- 데이터 수신 및 파싱 ---
def collect_data(port, duration=30):
    ser = serial.Serial(port, 921600)
    audio_frames = []
    bpm_history = [] # (시간, bpm) 저장
    
    start_time = time.time()
    print("녹음 및 심박수 수집 시작...")

    while time.time() - start_time < duration:
        if ser.read(1) == b'\xaa':
            if ser.read(1) == b'\xbb':
                data_type = ord(ser.read(1))
                length = struct.unpack('>H', ser.read(2))[0]
                payload = ser.read(length)

                if data_type == 0x01: # Audio
                    audio_frames.append(payload)
                elif data_type == 0x02: # BPM
                    bpm = struct.unpack('f', payload)[0]
                    elapsed = time.time() - start_time
                    bpm_history.append((elapsed, bpm))
                    print(f"[{elapsed:.1f}s] BPM: {bpm:.1f}")

    ser.close()
    return audio_frames, bpm_history

# --- 2~4단계 통합: 심박수 반영 ---
def process_therapy_with_bpm(audio_frames, bpm_history):
    # 1. 오디오 저장
    with wave.open("consultation.wav", 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(16000)
        wf.writeframes(b''.join(audio_frames))

    # 2. STT (Whisper)
    model = whisper.load_model("base")
    transcript = model.transcribe("consultation.wav")["text"]

    # 3. LLM 분석 (심박수 데이터 포함)
    # 심박수 평균 및 급증 구간 분석
    avg_bpm = sum(b[1] for b in bpm_history) / len(bpm_history) if bpm_history else 70
    max_bpm = max(b[1] for b in bpm_history) if bpm_history else 70
    
    client = OpenAI(api_key="YOUR_KEY")
    prompt = f"""
    환자의 상담 내용: {transcript}
    상담 중 심박수 데이터: 평균 {avg_bpm:.1f}, 최대 {max_bpm:.1f}.
    
    심박수가 {max_bpm:.1f}까지 올라갔을 때는 환자가 매우 불안해하는 상태입니다.
    이 데이터를 바탕으로 영상 시나리오 3장면을 짜주세요.
    심박수가 높았던 구간은 '강렬하고 역동적인' 이미지 프롬프트를, 
    안정된 구간은 '평온한' 이미지 프롬프트를 영어로 생성하세요.
    """
    
    # LLM 응답을 통해 이미지 생성 (DALL-E) 및 영상 편집 (MoviePy) 진행...
    # (이미지 생성 및 MoviePy 조립 로직은 이전 답변과 유사하지만 
    #  심박수 수치에 따라 영상의 '색감'이나 '필터'를 MoviePy에서 조절 가능)
    
    print("심박수 기반 영상 제작 완료.")

# 실행
audio, bpms = collect_data("COM3", duration=60)
process_therapy_with_bpm(audio, bpms)