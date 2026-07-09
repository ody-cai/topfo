package com.topfo.app.ui.files

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Download
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.topfo.app.ui.theme.*

private const val PDF_URL = "https://topfo.pages.dev/files/QS_World_Future_Skills_Index_2027.pdf"
private data class CR(val r: Int, val n: String, val s: Double)
private val t10 = listOf(CR(1,"美国",92.3),CR(2,"英国",90.8),CR(3,"新加坡",89.5),CR(4,"德国",88.7),CR(5,"加拿大",87.9),CR(6,"荷兰",86.5),CR(7,"澳大利亚",85.8),CR(8,"瑞士",85.2),CR(9,"丹麦",84.6),CR(10,"芬兰",83.9))
private data class CI(val n:String, val s:String, val t:String, val c:Color)
private val inds = listOf(CI("学术质量","92/100","领先",Indigo600),CI("研发投入","85/100","良好",Emerald500),CI("STEM毕业","68/100","待提升",Amber500),CI("数字技能","79/100","良好",Emerald500),CI("AI技能","54/100","缺口",Red500),CI("创新产出","82/100","良好",Emerald500),CI("产研合作","71/100","中等",Amber500),CI("终身学习","76/100","良好",Emerald500))
private val finds = listOf("AI技能缺口突出","学术准备度全球领先","STEM人才供给不足","数字技能转型加速","产研合作有待加强")
private val imps = listOf("重点发展AI和数字技能相关能力","提升雅思成绩以满足国际化录取要求","选择具有强产业合作的项目（Co-op、实习）","考虑双录取路径作为过渡方案","充分利用加拿大高质量的学术资源")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FileDetailScreen(viewModel: FilesViewModel, onBack: () -> Unit, modifier: Modifier = Modifier) {
    val state by viewModel.state.collectAsStateWithLifecycle(); val ctx = LocalContext.current
    Scaffold(topBar = { GlassTopBar("报告详情", onBack) }, modifier = modifier) { padding ->
        Column(Modifier.fillMaxWidth().padding(padding).verticalScroll(rememberScrollState()).padding(Dimens.screenPaddingHorizontal), verticalArrangement = Arrangement.spacedBy(Dimens.lg)) {
            GlassButton(onClick = { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(PDF_URL))) }, modifier = Modifier.fillMaxWidth(), label = "下载 PDF", icon = Icons.Filled.Download)
            GlassCard(Modifier.fillMaxWidth()) { Text("QS World Future Skills Index 2027", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold); Spacer(Modifier.height(Dimens.sm)); Text("89个经济体 · 62页", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant); Spacer(Modifier.height(Dimens.sm)); Surface(shape = RoundedCornerShape(Dimens.sm), color = Emerald50) { Text("全球排名第5 · 学术准备度第4", Modifier.padding(horizontal = Dimens.md, vertical = 6.dp), style = MaterialTheme.typography.labelLarge, color = Emerald600, fontWeight = FontWeight.Bold) } }
            SectionHeader("四大维度评估"); DimCard("学术准备度","89","/100",Indigo600); DimCard("经济转型","78","/100",Emerald500); DimCard("就业匹配","76","/100",Amber500); DimCard("技能缺口分析","AI技能缺口突出","",Red500)
            SectionHeader("全球 TOP 10")
            GlassCard(Modifier.fillMaxWidth(), contentPadding = PaddingValues(0.dp)) {
                Row(Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.surfaceVariant).padding(Dimens.md)) { Text("排名",Modifier.weight(0.5f),style=MaterialTheme.typography.labelMedium,fontWeight=FontWeight.Bold,color=Slate500); Text("国家/地区",Modifier.weight(2f),style=MaterialTheme.typography.labelMedium,fontWeight=FontWeight.Bold,color=Slate500); Text("总分",Modifier.weight(1f),style=MaterialTheme.typography.labelMedium,fontWeight=FontWeight.Bold,color=Slate500,textAlign= TextAlign.End) }
                t10.forEachIndexed { i, c -> val hl = c.r == 5; Row(Modifier.fillMaxWidth().padding(Dimens.md), verticalAlignment = Alignment.CenterVertically) { Text("${c.r}",Modifier.weight(0.5f),style=MaterialTheme.typography.bodyMedium,fontWeight=if(hl)FontWeight.Bold else FontWeight.Normal,color=if(hl)Indigo600 else Color.Unspecified); Text(c.n,Modifier.weight(2f),style=MaterialTheme.typography.bodyMedium,fontWeight=if(hl)FontWeight.Bold else FontWeight.Normal,color=if(hl)Indigo600 else Color.Unspecified); Text(String.format("%.1f",c.s),Modifier.weight(1f),style=MaterialTheme.typography.bodyMedium,fontWeight=if(hl)FontWeight.Bold else FontWeight.Normal,color=if(hl)Indigo600 else Color.Unspecified,textAlign= TextAlign.End) }; if (i < t10.lastIndex) Box(Modifier.fillMaxWidth().padding(horizontal = Dimens.md).height(0.5.dp).background(Slate200)) }
            }
            SectionHeader("加拿大深度分析"); inds.forEach { ind -> GlassCard(Modifier.fillMaxWidth()) { Row(verticalAlignment = Alignment.CenterVertically) { Box(Modifier.width(4.dp).height(40.dp).clip(RoundedCornerShape(2.dp)).background(ind.c)); Spacer(Modifier.width(Dimens.md)); Column(Modifier.weight(1f)) { Text(ind.n,style=MaterialTheme.typography.titleSmall,fontWeight=FontWeight.Medium); Text(ind.t,style=MaterialTheme.typography.bodySmall,color=ind.c) }; Text(ind.s,style=MaterialTheme.typography.titleLarge,fontWeight=FontWeight.Bold,color=ind.c) } } }
            SectionHeader("5大关键发现"); GlassCard(Modifier.fillMaxWidth()) { finds.forEachIndexed { i, f -> Row { Box(Modifier.size(24.dp).clip(CircleShape).background(MaterialTheme.colorScheme.primary), contentAlignment = Alignment.Center) { Text("${i+1}",style=MaterialTheme.typography.labelSmall,color=White,fontWeight=FontWeight.Bold) }; Spacer(Modifier.width(Dimens.sm)); Text(f,style=MaterialTheme.typography.bodyMedium) }; if (i < finds.lastIndex) Spacer(Modifier.height(Dimens.md)) } }
            SectionHeader("对升学规划的启示"); GlassCard(Modifier.fillMaxWidth(), color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)) { imps.forEach { Row { Text("•",style=MaterialTheme.typography.bodyMedium,color=MaterialTheme.colorScheme.primary,fontWeight=FontWeight.Bold); Spacer(Modifier.width(Dimens.sm)); Text(it,style=MaterialTheme.typography.bodyMedium) }; Spacer(Modifier.height(Dimens.sm)) } }
            Spacer(Modifier.height(Dimens.lg))
        }
    }
}

@Composable
private fun DimCard(title: String, score: String, suffix: String, accentColor: Color) { GlassCard(Modifier.fillMaxWidth()) { Row(verticalAlignment = Alignment.CenterVertically) { Box(Modifier.width(4.dp).height(48.dp).clip(RoundedCornerShape(2.dp)).background(accentColor)); Spacer(Modifier.width(Dimens.md)); Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f)); Text(score, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = accentColor); if (suffix.isNotEmpty()) Text(suffix, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant) } } }
