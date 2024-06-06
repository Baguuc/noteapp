// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, io::Write, path::Path};
use serde::{Deserialize, Serialize};
use tauri::api::file;


#[derive(Debug, Serialize, Deserialize)]
struct Note {
    id: u32,
    title: String,
    description: String,
    date_added: String
}

fn init_appdata(app_handle: tauri::AppHandle) {
    let binding = app_handle.path_resolver().app_data_dir().unwrap();
    let app_data_dir = binding.to_str().unwrap();
    let app_data_dir = app_data_dir.to_string();
    let notes_dir = format!("{}/notes", app_data_dir);

    if !binding.exists() {
        let _ = fs::create_dir_all(&app_data_dir);
    }

    if !Path::new(&notes_dir).exists() {
        let _ = fs::create_dir_all(&notes_dir);
    }
}

#[tauri::command]
fn init(app_handle: tauri::AppHandle) {
    init_appdata(app_handle)
}

#[tauri::command]
fn get_notes(app_handle: tauri::AppHandle) -> Vec<Note> {
    let binding = app_handle.path_resolver().app_data_dir().unwrap();
    let app_data_dir = binding.to_str().unwrap();
    let app_data_dir = app_data_dir.to_string();

    let notes_path = format!("{}/notes/", app_data_dir);

    let note_files = fs::read_dir(notes_path.clone());

    if note_files.is_err() {
        return vec![];
    }

    let note_files = note_files.unwrap();
    
    let mut notes: Vec<Note> = vec![];

    for note_file in note_files {
        if note_file.is_err() {
            continue;
        }

        let note_file = note_file.unwrap();

        let note_contents = fs::read_to_string(note_file.path());

        if note_contents.is_err() {
            continue;
        }

        let description = note_contents;

        if description.is_err() {
            continue;
        }

        let description = description.unwrap();

        let binding = note_file.file_name();
        let filename: &str = binding.to_str().unwrap_or("");

        if filename == "" {
            continue;
        }

        let filename = filename.split(".").nth(0).unwrap();
        
        let filename_split = filename.split("_").collect::<Vec<&str>>();
        let id: u32 = filename_split[0].parse().unwrap();
        let title: String = filename_split[1].parse().unwrap();
        let date_added: String = filename_split[2].parse().unwrap();

        let note = Note {
            id: id.clone(),
            title: title.clone(),
            description: description.clone(),
            date_added: date_added.clone()
        };

        notes.push(note);
    }

    return notes;
}

#[tauri::command]
fn add_notes(notes: Vec<Note>, app_handle: tauri::AppHandle) {
    let binding = app_handle.path_resolver().app_data_dir().unwrap();
    let app_data_dir = binding.to_str().unwrap();
    let app_data_dir = app_data_dir.to_string();
    let notes_dir = format!("{}/notes", app_data_dir);

    if !binding.exists() {
        let _ = fs::create_dir_all(&app_data_dir);
    }

    if !Path::new(&notes_dir).exists() {
        let _ = fs::create_dir_all(&notes_dir);
    }

    for note in notes {
        let filename = format!("{}_{}_{}.md", note.id, note.title, note.date_added);
        let file_path = format!("{}/{}", notes_dir, filename);
        let file = fs::File::create(file_path);

        if file.is_err() {
            continue;
        }

        let mut file = file.unwrap();
        let _ = file.write(note.description.as_bytes());
    }
}

#[tauri::command]
fn remove_notes(notes_ids: Vec<u32>, app_handle: tauri::AppHandle) {
    let binding = app_handle.path_resolver().app_data_dir().unwrap();
    let app_data_dir = binding.to_str().unwrap();
    let app_data_dir = app_data_dir.to_string();

    for id in notes_ids {
        for file in fs::read_dir(format!("{}/notes/", app_data_dir)).unwrap() {
            if file.is_err() {
                continue;
            }

            let file = file.unwrap();

            if !file.file_name().to_str().unwrap().starts_with(id.to_string().as_str()) {
                continue;
            }

            let _ = fs::remove_file(file.path());
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_notes, add_notes, remove_notes, init])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
