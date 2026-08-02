---
title: AnB
description: 계약 요청부터 다자간 승인, 지갑 서명, 결제와 스마트컨트랙트 기록까지 연결한 블록체인 기반 부동산 계약 시스템입니다.
category: Backend · Blockchain
status: completed
featured: true
order: 4
period: 2025.03 — 2025.06
role: Backend · 3인 팀
publishedAt: 2026-08-02
tags:
  - TypeScript
  - Express
  - TypeORM
  - PostgreSQL
  - ethers
  - Stripe
  - JWT
  - Docker
repository: https://github.com/yb0x00/AnB-backend-project
---

## 프로젝트 개요

전남대학교 컴퓨터정보통신공학과 졸업논문으로 진행한 블록체인 기반 부동산 계약 시스템입니다. 프론트엔드, 백엔드, 블록체인 영역을 나눈 3인 팀으로 개발했으며 교내 2025 하계 NCCOSS 경진대회 우수상을 수상했습니다.

## 백엔드 구현

- JWT 인증과 임차인·임대인·중개사 역할별 권한 처리
- 계약 요청과 임대인·중개사 승인 상태를 관리하는 Express API
- TypeORM과 PostgreSQL 기반 계약·매물·서명·결제 데이터 모델
- `ethers.verifyMessage`를 이용한 지갑 서명 검증과 중복 서명 방지
- 모든 참여자의 서명이 완료된 뒤 스마트컨트랙트 트랜잭션과 애플리케이션 상태를 동기화하는 흐름
- Stripe Checkout 기반 계약금 결제와 잔금 결제 알림 스케줄링
- Node.js 애플리케이션과 PostgreSQL을 실행하는 Docker 개발 환경

## 기술적 초점

온체인 트랜잭션의 완료 여부와 오프체인 계약 상태가 어긋나지 않도록 트랜잭션 확인 후 블록체인 계약 ID와 처리 상태를 저장했습니다. 서명 단계에서는 계약 참여자인지 검증하고 이미 등록된 서명을 차단해 다자간 계약 흐름의 무결성을 지켰습니다.

[GitHub 저장소에서 백엔드 구현 보기](https://github.com/yb0x00/AnB-backend-project)
