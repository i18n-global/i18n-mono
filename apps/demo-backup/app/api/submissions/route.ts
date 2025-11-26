import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

// POST: 새 제출 생성
export async function POST(request: NextRequest) {
  try {
    // Check if Firebase is configured
    if (!db) {
      return NextResponse.json(
        {
          error: "Firestore Database is not configured. Please set up Firebase environment variables.",
          code: "FIRESTORE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      url,
      projectName,
      autoTitle,
      autoDescription,
      thumbnailUrl,
      screenshotUrl,
      contactEmail
    } = body;

    if (!url || !autoTitle) {
      return NextResponse.json(
        { error: "URL and title are required" },
        { status: 400 }
      );
    }

    const submissionData = {
      url,
      projectName: projectName || null,
      autoTitle,
      autoDescription: autoDescription || "",
      thumbnailUrl: thumbnailUrl || "/default-thumbnail.svg",
      screenshotUrl: screenshotUrl || null,
      contactEmail: contactEmail || null,
      approved: false,
      submittedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, "submissions"), submissionData);

    // On-Demand Revalidation: 새 제출이 추가되면 showcase 페이지 갱신
    // (승인되지 않았으므로 showcase에는 표시되지 않지만, 나중에 승인될 수 있음)
    revalidatePath("/showcase");

    return NextResponse.json({
      id: docRef.id,
      ...submissionData
    });
  } catch (error: unknown) {
    console.error("Submission creation error:", error);

    const errorObj = error as { code?: string; message?: string };

    // Firestore 관련 에러 감지
    if (
      errorObj.code?.includes("firestore") ||
      errorObj.message?.includes("Firestore")
    ) {
      return NextResponse.json(
        {
          error:
            "Firestore Database is not configured. Please create Firestore Database in Firebase Console.",
          code: "FIRESTORE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create submission",
        message: errorObj.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET: 제출 목록 가져오기 (필터 옵션 포함)
export async function GET(request: NextRequest) {
  try {
    // Check if Firebase is configured
    if (!db) {
      return NextResponse.json(
        {
          error: "Firestore Database is not configured. Please set up Firebase environment variables.",
          code: "FIRESTORE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const approvedFilter = searchParams.get("approved");

    let q = query(
      collection(db, "submissions"),
      orderBy("submittedAt", "desc")
    );

    if (approvedFilter !== null) {
      const isApproved = approvedFilter === "true";
      q = query(
        collection(db, "submissions"),
        where("approved", "==", isApproved),
        orderBy("submittedAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const submissions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(submissions);
  } catch (error: unknown) {
    console.error("Fetch submissions error:", error);

    const errorObj = error as { code?: string; message?: string };

    // Firestore 인덱스 에러 감지
    if (
      errorObj.message?.includes("index") ||
      errorObj.message?.includes("Index")
    ) {
      // 에러 메시지에서 인덱스 생성 URL 추출
      const indexUrl = errorObj.message.match(/https:\/\/[^\s]+/)?.[0];

      return NextResponse.json(
        {
          error:
            "Firestore index is required. Please click the link below to create the index.",
          code: "FIRESTORE_INDEX_REQUIRED",
          indexUrl:
            indexUrl ||
            "https://console.firebase.google.com/u/0/project/i18nexus/firestore/indexes",
          message: errorObj.message,
        },
        { status: 500 }
      );
    }

    // Firestore 관련 에러 감지
    if (
      errorObj.code?.includes("firestore") ||
      errorObj.message?.includes("Firestore")
    ) {
      return NextResponse.json(
        {
          error:
            "Firestore Database is not configured. Please create Firestore Database in Firebase Console.",
          code: "FIRESTORE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch submissions",
        message: errorObj.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH: 제출 업데이트 (승인/거부)
export async function PATCH(request: NextRequest) {
  try {
    // Check if Firebase is configured
    if (!db) {
      return NextResponse.json(
        {
          error: "Firestore Database is not configured. Please set up Firebase environment variables.",
          code: "FIRESTORE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id, approved, projectName, autoTitle } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "submissions", id);
    const updateData: Record<string, unknown> = {};

    if (approved !== undefined) updateData.approved = approved;
    if (projectName !== undefined) updateData.projectName = projectName;
    if (autoTitle !== undefined) updateData.autoTitle = autoTitle;

    await updateDoc(docRef, updateData);

    // On-Demand Revalidation: 승인 상태가 변경되면 showcase 페이지 갱신
    if (approved !== undefined) {
      revalidatePath("/showcase");
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Submission update error:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}

// DELETE: 제출 삭제
export async function DELETE(request: NextRequest) {
  try {
    // Check if Firebase is configured
    if (!db) {
      return NextResponse.json(
        {
          error: "Firestore Database is not configured. Please set up Firebase environment variables.",
          code: "FIRESTORE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    await deleteDoc(doc(db, "submissions", id));

    // On-Demand Revalidation: 제출이 삭제되면 showcase 페이지 갱신
    revalidatePath("/showcase");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Submission deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}