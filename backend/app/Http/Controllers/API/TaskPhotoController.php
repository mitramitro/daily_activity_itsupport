<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TaskPhoto;
use App\Models\Task;
use Illuminate\Support\Facades\Storage;

class TaskPhotoController extends Controller
{
    public function store(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        // 🔥 validation
        $request->validate([
            'photos.*' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        if (!$request->hasFile('photos')) {
            return response()->json([
                'message' => 'No files uploaded'
            ], 400);
        }

        foreach ($request->file('photos') as $file) {
            $path = $file->store('tasks', 'public');

            $task->photos()->create([
                'photo' => $path
            ]);
        }

        return response()->json([
            'message' => 'Photos uploaded successfully',
            'data' => $task->load('photos')
        ]);
    }

    public function destroy($id)
    {
        $photo = TaskPhoto::findOrFail($id);

        // 🔥 safe delete file
        if ($photo->photo && Storage::disk('public')->exists($photo->photo)) {
            Storage::disk('public')->delete($photo->photo);
        }

        $photo->delete();

        return response()->json([
            'message' => 'Photo deleted successfully'
        ]);
    }
}
