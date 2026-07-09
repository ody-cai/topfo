package com.topfo.app.ui.profile.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileEditSheet(
    currentGpa: Double?,
    currentIelts: Double?,
    onSave: (Double?, Double?) -> Unit,
    onDismiss: () -> Unit
) {
    var gpa by remember { mutableStateOf(currentGpa?.toString() ?: "") }
    var ielts by remember { mutableStateOf(currentIelts?.toString() ?: "") }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "编辑个人数据",
            style = MaterialTheme.typography.headlineMedium
        )
        Text(
            text = "仅 caiqijun 登录后可使用",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        OutlinedTextField(
            value = gpa,
            onValueChange = { gpa = it },
            label = { Text("GPA") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        OutlinedTextField(
            value = ielts,
            onValueChange = { ielts = it },
            label = { Text("雅思总分") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            TextButton(onClick = onDismiss) {
                Text("取消")
            }
            Spacer(modifier = Modifier.width(8.dp))
            Button(onClick = {
                onSave(
                    gpa.toDoubleOrNull(),
                    ielts.toDoubleOrNull()
                )
            }) {
                Text("保存")
            }
        }
    }
}
